import { readdir } from "fs/promises";
import Path from "path";
import Glob from "glob";
import { readPackage } from "./Utils";
import LicenseChecker from "license-checker";

const KnownLockFileNames = ["pnpm-lock.yaml"];

export const resolveAllDependencies = async (
  excludePackagePrefix: readonly string[]
): Promise<Map<string, LicenseChecker.ModuleInfo>> => {
  // ロックファイルの存在するディレクトリをさかのぼって見つける
  const repositoryRoot = await findRepositoryRoot(process.cwd());

  // 見つけたディレクトリを起点として全ての package.json を取得
  const allPackageFiles = await new Promise<string[]>((res, rej) =>
    Glob(repositoryRoot + "/**/package.json", (err, matches) => {
      if (err !== null) {
        rej(err);
        return;
      }
      res(matches.filter((fn) => !fn.includes("node_modules")));
    })
  );

  // ユニーク化しつつ、全パッケージの依存関係を列挙
  const packageToLicenseMap = new Map<string, LicenseChecker.ModuleInfo>();
  for (const packageFileName of allPackageFiles) {
    const packageObj = await readPackage(packageFileName);
    // そもそも何にも依存していない場合はスキップする
    if (
      Object.entries(packageObj.dependencies ?? {}).length === 0 &&
      Object.entries(packageObj.devDependencies ?? {}).length === 0
    ) {
      continue;
    }
    const moduleInfos = await new Promise<LicenseChecker.ModuleInfos>(
      (res, rej) => {
        LicenseChecker.init(
          {
            start: Path.dirname(packageFileName),
          },
          (err, packages) => {
            if (err) {
              rej(err);
            } else {
              res(packages);
            }
          }
        );
      }
    );
    const allLocalLicenses = new Map<string, LicenseChecker.ModuleInfo>(
      Object.entries(moduleInfos).map<[string, LicenseChecker.ModuleInfo]>(
        ([packageName, moduleInfo]) => [
          packageName.slice(0, packageName.lastIndexOf("@")),
          moduleInfo,
        ]
      )
    );

    Object.entries(packageObj.dependencies ?? {})
      .concat(Object.entries(packageObj.devDependencies ?? {}))
      .forEach(([depName, version]) => {
        if (excludePackagePrefix.some((p) => depName.startsWith(p))) {
          return;
        }
        const depKey = resolvePackageName(depName, version);
        const license = allLocalLicenses.get(depKey);
        if (license === undefined) {
          throw new Error(
            `次のパッケージのライセンス情報を発見できませんでした: ${depName}(${depKey})`
          );
        }

        packageToLicenseMap.set(depKey, license);
      });
  }

  return packageToLicenseMap;
};

export const findRepositoryRoot = async (
  currentDir: string
): Promise<string> => {
  const files = new Set(await readdir(currentDir));
  if (KnownLockFileNames.some((fn) => files.has(fn))) {
    return currentDir;
  }

  return await findRepositoryRoot(Path.resolve(Path.join(currentDir, "../")));
};

const resolvePackageName = (
  depName: string,
  versionSpecifier: string
): string => {
  if (versionSpecifier.startsWith("npm:")) {
    return versionSpecifier
      .slice(0, versionSpecifier.lastIndexOf("@"))
      .replace("npm:", "");
  }
  return depName;
};

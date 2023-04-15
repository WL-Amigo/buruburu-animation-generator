import { Plugin } from "vite";
import { License } from "./Types";
import { resolveLicenses } from "./Utils";
import { resolveAllDependencies } from "./ResolveAllPackages";

const ModuleName = "virtual:licenses";

export interface LicenseListPluginOptions {
  exclude?: readonly string[];
}

export const LicenseListPlugin = (
  options?: LicenseListPluginOptions
): Plugin => {
  return {
    name: "license-list",
    resolveId(id) {
      if (id === ModuleName) {
        return ModuleName;
      }
    },
    async load(id) {
      if (id !== ModuleName) {
        return undefined;
      }

      const packageToLicenseMap = await resolveAllDependencies(
        options?.exclude ?? []
      );
      let result = Array.from(packageToLicenseMap).map<License>(
        ([packageName, moduleInfo]) => {
          return {
            name: packageName,
            license: resolveLicenses(moduleInfo.licenses),
            url: moduleInfo.repository ?? moduleInfo.url ?? "",
          };
        }
      );

      if (options?.exclude !== undefined) {
        const excludePackageNames = options.exclude;
        result = result.filter(
          (l) => !excludePackageNames.some((pn) => l.name.includes(pn))
        );
      }

      return `export const Licenses = ${JSON.stringify(
        result
      )}; export default Licenses;`;
    },
  };
};

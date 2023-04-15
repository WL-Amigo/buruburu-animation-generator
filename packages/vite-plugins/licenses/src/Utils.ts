import { readFile } from "node:fs/promises";
import { Package } from "./Types";

export const resolveLicenses = (
  licenses: string | string[] | undefined
): string => {
  if (licenses === undefined) {
    return "";
  }
  return typeof licenses === "string" ? licenses : licenses.join(", ");
};

export const readJson = async (fileName: string): Promise<unknown> => {
  return JSON.parse(await readFile(fileName, "utf8"));
};

const isPackage = (obj: unknown): obj is Package => {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  return true;
};

export const readPackage = async (
  packageFileName: string
): Promise<Package> => {
  const json = await readJson(packageFileName);
  if (!isPackage(json)) {
    throw new Error(`${packageFileName} is not package.json`);
  }

  return json;
};

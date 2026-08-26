export const INKOS_VN_PACKAGE_NAMES = new Map([
  ["@actalk/inkos-core", "inkos-vn-core"],
  ["@actalk/inkos-studio", "inkos-vn-studio"],
  ["@actalk/inkos", "inkos-vn"],
]);

export function isInkosVnPublish(env = process.env) {
  return env.INKOS_VN_PUBLISH === "1";
}

export function inkosVnPackageName(sourceName) {
  return INKOS_VN_PACKAGE_NAMES.get(sourceName) ?? sourceName;
}

export function inkosVnAlias(sourceName, versionSpecifier) {
  return `npm:${inkosVnPackageName(sourceName)}@${versionSpecifier}`;
}

import { AbiParameter } from "viem";

export function formatParamType(
  param: AbiParameter,
  fullFormat: boolean = false,
  includeName: boolean = false,
): string {
  let typeStr = "";

  if (param.type === "tuple" || param.type === "tuple[]") {
    if (fullFormat && "components" in param && param.components) {
      const separator = includeName ? ", " : ",";
      const components = param.components
        .map((c) => formatParamType(c, true, includeName))
        .join(separator);
      const tupleStr = `(${components})`;
      typeStr = param.type.endsWith("[]") ? `${tupleStr}[]` : tupleStr;
    } else {
      typeStr = param.type;
    }
  } else if (
    param.type.endsWith("[]") &&
    "components" in param &&
    param.components
  ) {
    const baseParam = {
      ...param,
      type: param.type.slice(0, -2),
    } as AbiParameter;
    typeStr = formatParamType(baseParam, fullFormat, includeName) + "[]";
  } else {
    typeStr = param.type;
  }

  if (includeName && param.name) {
    return `${typeStr} ${param.name}`;
  }

  return typeStr;
}

export function formatEventParam(
  param: AbiParameter & { indexed?: boolean },
  includeName: boolean = false,
): string {
  let typeStr = "";

  if (param.type === "tuple" || param.type === "tuple[]") {
    if ("components" in param && param.components) {
      const separator = includeName ? ", " : ",";
      const components = param.components
        .map((c) => formatParamType(c, true, includeName))
        .join(separator);
      const tupleStr = `(${components})`;
      typeStr = param.type.endsWith("[]") ? `${tupleStr}[]` : tupleStr;
    } else {
      typeStr = param.type;
    }
  } else if (
    param.type.endsWith("[]") &&
    "components" in param &&
    param.components
  ) {
    const baseParam = {
      ...param,
      type: param.type.slice(0, -2),
    } as AbiParameter & { indexed?: boolean };
    typeStr =
      formatEventParam(baseParam, includeName).replace(/ indexed$/, "") + "[]";
  } else {
    typeStr = param.type;
  }

  const indexedStr = param.indexed ? " indexed" : "";
  const nameStr = includeName && param.name ? ` ${param.name}` : "";
  return `${typeStr}${indexedStr}${nameStr}`;
}

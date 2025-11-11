import { AbiError } from "abitype";
import { formatParamType } from "./parameter-formatter.js";

export function buildFullErrorSignature(error: AbiError): string {
  const inputs =
    error.inputs
      ?.map((param) => formatParamType(param, true, true))
      .join(", ") ?? "";
  return `error ${error.name}(${inputs})`;
}

export function buildMinimalErrorSignature(error: AbiError): string {
  const inputs =
    error.inputs
      ?.map((param) => formatParamType(param, true, false))
      .join(",") ?? "";
  return `error ${error.name}(${inputs})`;
}

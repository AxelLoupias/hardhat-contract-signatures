import { AbiFunction } from "viem";
import { STATE_MODIFIERS, StateMutability } from "../constants.js";
import { formatParamType } from "./parameter-formatter.js";

export interface FunctionSignatureOptions {
  includeNames: boolean;
  includeModifiers: boolean;
  includeReturns: boolean;
  includePrefix: boolean;
}

export function buildFunctionSignature(
  func: AbiFunction,
  options: FunctionSignatureOptions,
): string {
  const { includeNames, includeModifiers, includeReturns, includePrefix } =
    options;

  const separator = includeNames ? ", " : ",";
  const inputs = func.inputs
    .map((param) => formatParamType(param, true, includeNames))
    .join(separator);

  const modifiersStr =
    includeModifiers &&
    STATE_MODIFIERS.includes(func.stateMutability as StateMutability)
      ? ` ${func.stateMutability}`
      : "";

  let outputsStr = "";
  if (includeReturns && func.outputs && func.outputs.length > 0) {
    const returns = func.outputs
      .map((param) => formatParamType(param, true, includeNames))
      .join(separator);
    outputsStr = ` returns (${returns})`;
  }

  const prefix = includePrefix ? "function " : "";
  return `${prefix}${func.name}(${inputs})${modifiersStr}${outputsStr}`;
}

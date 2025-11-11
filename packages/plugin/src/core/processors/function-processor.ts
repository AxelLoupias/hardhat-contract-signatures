import { AbiFunction, toFunctionSelector, toFunctionSignature } from "viem";
import { buildFunctionSignature } from "../formatters/function-formatter.js";

export const FunctionProcessor = {
  getSelector: (func: AbiFunction): string => toFunctionSelector(func),
  getSignature: (func: AbiFunction): string => toFunctionSignature(func),
  getFullSignature: (func: AbiFunction): string => {
    return buildFunctionSignature(func, {
      includeNames: true,
      includeModifiers: true,
      includeReturns: true,
      includePrefix: true,
    });
  },
  getMinimalSignature: (func: AbiFunction): string => {
    return buildFunctionSignature(func, {
      includeNames: false,
      includeModifiers: true,
      includeReturns: true,
      includePrefix: true,
    });
  },
};

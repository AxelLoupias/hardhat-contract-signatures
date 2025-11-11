import { keccak256, stringToBytes } from "viem";
import { AbiError } from "abitype";
import {
  buildFullErrorSignature,
  buildMinimalErrorSignature,
} from "../formatters/error-formatter.js";

export const ErrorProcessor = {
  getSelector: (error: AbiError): string => {
    const signature = `${error.name}(${error.inputs?.map((i) => i.type).join(",") ?? ""})`;
    return keccak256(stringToBytes(signature)).slice(0, 10);
  },

  getSignature: (error: AbiError): string => {
    return `${error.name}(${error.inputs?.map((i) => i.type).join(",") ?? ""})`;
  },
  getFullSignature: (error: AbiError): string => buildFullErrorSignature(error),

  getMinimalSignature: (error: AbiError): string =>
    buildMinimalErrorSignature(error),
};

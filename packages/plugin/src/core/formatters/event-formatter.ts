import { AbiEvent, AbiParameter } from "viem";
import { formatEventParam } from "./parameter-formatter.js";

export function buildFullEventSignature(event: AbiEvent): string {
  const inputs = event.inputs
    .map((param) =>
      formatEventParam(param as AbiParameter & { indexed?: boolean }, true),
    )
    .join(", ");
  return `event ${event.name}(${inputs})`;
}

export function buildMinimalEventSignature(event: AbiEvent): string {
  const inputs = event.inputs
    .map((param) =>
      formatEventParam(param as AbiParameter & { indexed?: boolean }, false),
    )
    .join(", ");
  return `event ${event.name}(${inputs})`;
}

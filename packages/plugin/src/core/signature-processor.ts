import { Abi } from "hardhat/types/artifacts";
import { CellOptions } from "cli-table3";
import {
  AbiFunction,
  AbiEvent,
  toFunctionSelector,
  toFunctionSignature,
  toEventSelector,
  toEventSignature,
  keccak256,
  stringToBytes,
} from "viem";
import { AbiError } from "abitype";
import { FormatColumns, FragmentType } from "../types.js";

type AbiFragment = AbiFunction | AbiEvent | AbiError;

interface SignatureProcessor {
  getSelector: (fragment: AbiFragment) => string;
  getSignature: (fragment: AbiFragment) => string;
  getFullSignature: (fragment: AbiFragment) => string;
}

const SIGNATURE_PROCESSORS: Record<FragmentType, SignatureProcessor> = {
  function: {
    getSelector: (fnt) => toFunctionSelector(fnt as AbiFunction),
    getSignature: (fnt) => toFunctionSignature(fnt as AbiFunction),
    getFullSignature: (fnt) => {
      const func = fnt as AbiFunction;
      return `${func.name}(${func.inputs.map((i) => i.type).join(",")}) returns (${
        func.outputs?.map((o) => o.type).join(",") ?? ""
      })`;
    },
  },
  event: {
    getSelector: (evt) => toEventSelector(evt as AbiEvent),
    getSignature: (evt) => toEventSignature(evt as AbiEvent),
    getFullSignature: (evt) => {
      const event = evt as AbiEvent;
      return `${event.name}(${event.inputs.map((i) => i.type).join(",")})`;
    },
  },
  error: {
    getSelector: (err) => {
      const error = err as AbiError;
      const signature = `${error.name}(${error.inputs?.map((i) => i.type).join(",") ?? ""})`;
      return keccak256(stringToBytes(signature)).slice(0, 10);
    },
    getSignature: (err) => {
      const error = err as AbiError;
      return `${error.name}(${error.inputs?.map((i) => i.type).join(",") ?? ""})`;
    },
    getFullSignature: (err) => {
      const error = err as AbiError;
      return `${error.name}(${error.inputs?.map((i) => i.type).join(",") ?? ""})`;
    },
  },
};

export interface SignatureProcessingParams {
  abi: Abi;
  contractName: string;
  typeAllowed: FragmentType[];
  showColumns: FormatColumns[];
  find?: string;
}

export function getDataSignature({
  abi,
  contractName,
  typeAllowed,
  showColumns,
  find,
}: SignatureProcessingParams): CellOptions[][] {
  const isFinding = find !== undefined;
  const data: CellOptions[][] = [];

  const contractData = abi.filter((item) =>
    typeAllowed.includes(item.type as FragmentType),
  ) as AbiFragment[];

  for (let index = 0; index < contractData.length; index++) {
    const fragment = contractData[index];
    const fragmentType = fragment.type as FragmentType;
    const processor = SIGNATURE_PROCESSORS[fragmentType];

    const selector = processor.getSelector(fragment);
    const signature = processor.getSignature(fragment);
    const fullSignature = processor.getFullSignature(fragment);
    const json = JSON.stringify(fragment, null, 0);
    const minimal = signature;

    const actions: Record<FormatColumns, () => CellOptions> = {
      topicHash: () => ({ content: selector }),
      selector: () => ({ content: selector }),
      "sign:full": () => ({ content: fullSignature }),
      "sign:json": () => ({ content: json }),
      "sign:minimal": () => ({ content: minimal }),
      "sign:sighash": () => ({ content: signature }),
      type: () => ({ content: fragment.type }),
    };

    if (isFinding && !selector.includes(find) && fragment.name !== find) {
      continue;
    }

    const row: CellOptions[] =
      index === 0 || isFinding
        ? [
            {
              content: contractName,
              rowSpan: !isFinding ? contractData.length : 0,
            },
          ]
        : [];

    row.push({ content: fragment.name });
    row.push(...showColumns.map((column) => actions[column]()));

    data.push(row);
  }

  return data;
}

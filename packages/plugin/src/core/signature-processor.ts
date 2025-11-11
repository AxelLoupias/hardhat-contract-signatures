import { Abi } from "hardhat/types/artifacts";
import { CellOptions } from "cli-table3";
import { AbiFunction, AbiEvent, toEventSelector } from "viem";
import { AbiError } from "abitype";
import { FormatColumns, FragmentType } from "../types.js";
import { FunctionProcessor } from "./processors/function-processor.js";
import { EventProcessor } from "./processors/event-processor.js";
import { ErrorProcessor } from "./processors/error-processor.js";

type AbiFragment = AbiFunction | AbiEvent | AbiError;

interface SignatureProcessor {
  getSelector: (fragment: AbiFragment) => string;
  getSignature: (fragment: AbiFragment) => string;
  getFullSignature: (fragment: AbiFragment) => string;
  getMinimalSignature: (fragment: AbiFragment) => string;
}

const SIGNATURE_PROCESSORS: Record<FragmentType, SignatureProcessor> = {
  function: {
    getSelector: (fragment) =>
      FunctionProcessor.getSelector(fragment as AbiFunction),
    getSignature: (fragment) =>
      FunctionProcessor.getSignature(fragment as AbiFunction),
    getFullSignature: (fragment) =>
      FunctionProcessor.getFullSignature(fragment as AbiFunction),
    getMinimalSignature: (fragment) =>
      FunctionProcessor.getMinimalSignature(fragment as AbiFunction),
  },
  event: {
    getSelector: (fragment) => EventProcessor.getSelector(fragment as AbiEvent),
    getSignature: (fragment) =>
      EventProcessor.getSignature(fragment as AbiEvent),
    getFullSignature: (fragment) =>
      EventProcessor.getFullSignature(fragment as AbiEvent),
    getMinimalSignature: (fragment) =>
      EventProcessor.getMinimalSignature(fragment as AbiEvent),
  },
  error: {
    getSelector: (fragment) => ErrorProcessor.getSelector(fragment as AbiError),
    getSignature: (fragment) =>
      ErrorProcessor.getSignature(fragment as AbiError),
    getFullSignature: (fragment) =>
      ErrorProcessor.getFullSignature(fragment as AbiError),
    getMinimalSignature: (fragment) =>
      ErrorProcessor.getMinimalSignature(fragment as AbiError),
  },
};

export interface SignatureProcessingParams {
  abi: Abi;
  contractName: string;
  typeAllowed: FragmentType[];
  showColumns: FormatColumns[];
  find?: string;
  forceContractColumn?: boolean;
}

export function getDataSignature({
  abi,
  contractName,
  typeAllowed,
  showColumns,
  find,
  forceContractColumn = false,
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
    const minimal = processor.getMinimalSignature(fragment);

    const actions: Record<FormatColumns, () => CellOptions> = {
      topicHash: () => ({
        content: toEventSelector(fragment as AbiEvent),
      }),
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
      index === 0 || isFinding || forceContractColumn
        ? [
            {
              content: contractName,
              rowSpan:
                !isFinding && !forceContractColumn ? contractData.length : 0,
            },
          ]
        : [];

    row.push({ content: fragment.name });
    row.push(...showColumns.map((column) => actions[column]()));

    data.push(row);
  }

  return data;
}

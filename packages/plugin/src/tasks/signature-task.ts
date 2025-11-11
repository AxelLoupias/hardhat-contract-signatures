import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { CellOptions } from "cli-table3";
import { getContractsConfig, isContract } from "../core/contracts.js";
import { getDataSignature } from "../core/signature-processor.js";
import { drawTable, getNamesFormatColumns } from "../ui/table.js";
import { FragmentType, FormatColumns, ContractsConfig } from "../types.js";

export interface SignatureTaskConfig {
  fragmentType: FragmentType[];
  columnName: string;
  getColumns: (config: ContractsConfig) => FormatColumns[];
}

export async function executeSignatureTask(
  taskArguments: unknown,
  hre: HardhatRuntimeEnvironment,
  config: SignatureTaskConfig,
) {
  const contractsConfig = await getContractsConfig(hre);
  const columns = config.getColumns(contractsConfig);
  const data: CellOptions[][] = [];
  const isJsonOutput = (taskArguments as { json?: boolean })?.json ?? false;

  for (const contractData of contractsConfig.contracts) {
    if (!(await isContract(hre, contractData.qualifiedName))) {
      continue;
    }

    const artifact = await hre.artifacts.readArtifact(
      contractData.qualifiedName,
    );

    const find = (taskArguments as { find?: string })?.find;

    const signatureData = getDataSignature({
      abi: artifact.abi,
      contractName: contractData.name,
      typeAllowed: config.fragmentType,
      showColumns: columns,
      find,
      forceContractColumn: isJsonOutput,
    });

    if (signatureData.length === 0) {
      continue;
    }

    data.push(...signatureData);
  }

  if (isJsonOutput) {
    const headers = [
      "contract",
      config.columnName,
      ...getNamesFormatColumns(columns),
    ];

    const jsonData = data.map((row) => {
      const obj: Record<string, string> = {};

      row.forEach((cell, index) => {
        const header = headers[index];
        if (header) {
          obj[header] =
            typeof cell === "object" && "content" in cell
              ? String(cell.content)
              : String(cell);
        }
      });

      return obj;
    });

    console.log(JSON.stringify(jsonData, null, 2));
  } else {
    drawTable([config.columnName, ...getNamesFormatColumns(columns)], data);
  }
}

export const TASK_CONFIGS: Record<string, SignatureTaskConfig> = {
  functions: {
    fragmentType: ["function"],
    columnName: "functionName",
    getColumns: (config) => config.functionsColumns,
  },
  events: {
    fragmentType: ["event"],
    columnName: "eventName",
    getColumns: (config) => config.eventsColumns,
  },
  errors: {
    fragmentType: ["error"],
    columnName: "errorName",
    getColumns: (config) => config.errorsColumns,
  },
  find: {
    fragmentType: ["function", "event", "error"],
    columnName: "name",
    getColumns: (config) => config.findColumns,
  },
};

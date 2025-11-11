import { type HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { minimatch } from "minimatch";
import { ContractArtifactData, ContractsConfig } from "../types.js";

export const PLUGIN_NAME = "hardhat-contract-signatures";

export async function getContractsData(
  hre: HardhatRuntimeEnvironment,
): Promise<ContractArtifactData[]> {
  const contracts = await hre.artifacts.getAllFullyQualifiedNames();

  return Array.from(contracts).map((contract) => {
    const [path, name] = contract.split(":");
    return { path, name, qualifiedName: contract };
  });
}

export async function isContract(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
): Promise<boolean> {
  const artifact = await hre.artifacts.readArtifact(contractName);
  return artifact.bytecode !== "0x";
}

export function excludeContracts(
  contracts: ContractArtifactData[],
  exclude: string[],
) {
  return contracts.filter((contract) => {
    return !exclude.some((pattern) => minimatch(contract.path, pattern));
  });
}

export async function getContractsConfig(
  hre: HardhatRuntimeEnvironment,
): Promise<ContractsConfig> {
  const excludeContractsConfig = hre.config.contractSignature.exclude;
  const functionsColumns = hre.config.contractSignature.functionsColumns;
  const eventsColumns = hre.config.contractSignature.eventsColumns;
  const errorsColumns = hre.config.contractSignature.errorsColumns;
  const findColumns = hre.config.contractSignature.findColumns;

  await hre.tasks.getTask("compile").run();
  const contractsData = await getContractsData(hre);

  return {
    contracts: excludeContracts(contractsData, excludeContractsConfig),
    functionsColumns,
    eventsColumns,
    errorsColumns,
    findColumns,
  };
}

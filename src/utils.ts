import { HardhatPluginError } from 'hardhat/plugins'
import { type HardhatRuntimeEnvironment } from 'hardhat/types'
import { COLUMNS_NAMES, PLUGIN_NAME } from './consts'
import { type ContractArtifactData, type FormatColumns } from './types/types'
import { minimatch } from 'minimatch'

export async function getContractsData(
	hre: HardhatRuntimeEnvironment
): Promise<ContractArtifactData[]> {
	const contracts = await hre.artifacts.getAllFullyQualifiedNames()

	if (contracts.length === 0) {
		throw new HardhatPluginError(
			PLUGIN_NAME,
			`There are no compiled contracts.`
		)
	}

	return contracts.map((contract) => {
		const [path, name] = contract.split(':')
		return { path, name }
	})
}

export function getNamesFormatColumns(columnsType: FormatColumns[]) {
	return columnsType.map((item) => {
		return COLUMNS_NAMES[item]
	})
}

export async function isContract(
	hre: HardhatRuntimeEnvironment,
	contractName: string
) {
	const artifact = await hre.artifacts.readArtifact(contractName)
	return artifact.bytecode !== '0x'
}

export function excludeContracts(
	contracts: ContractArtifactData[],
	exclude: string[]
) {
	return contracts.filter((contract) => {
		return !exclude.some((pattern) => minimatch(contract.path, pattern))
	})
}

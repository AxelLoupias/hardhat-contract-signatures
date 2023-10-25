import { scope } from 'hardhat/config'
import '@nomicfoundation/hardhat-ethers'
import Table, { type CellOptions } from 'cli-table3'
import {
	type EventsFormatColumns,
	type FunctionFormatColumns,
} from '../types/types'
import {
	getContractsData,
	getNamesFormatColumns,
	isContract,
	excludeContracts,
} from '../utils'
import { type Interface } from 'ethers'
import { type HardhatRuntimeEnvironment } from 'hardhat/types'
// TODO: save data in file

// Add errors
// Try structs
const signature = scope('signature', 'test')

signature
	.task('functions', 'Get the signatures of the differents methods of a SC')
	.setAction(async (args, hre) => {
		const { contracts, functionsColumns } = await getContractsConfig(hre)
		const data = []
		for (const contractData of contracts) {
			if (!(await isContract(hre, contractData.name))) {
				continue
			}
			const contractInterface = (
				await hre.ethers.getContractFactory(contractData.name)
			).interface
			const functionData = getFunctionsData(
				contractInterface,
				contractData.name,
				functionsColumns
			)
			if (functionData.length === 0) {
				continue
			}
			data.push(...functionData)
		}

		drawTable(
			['methodName', ...getNamesFormatColumns(functionsColumns)],
			data
		)
	})

signature
	.task('events', 'Get the events of the differents methods of a SC')
	.setAction(async (args, hre) => {
		const { contracts, eventsColumns } = await getContractsConfig(hre)
		const data = []
		for (const contractData of contracts) {
			if (!(await isContract(hre, contractData.name))) {
				continue
			}
			const contractInterface = (
				await hre.ethers.getContractFactory(contractData.name)
			).interface
			const eventsData = getEventsData(
				contractInterface,
				contractData.name,
				eventsColumns
			)
			if (eventsData.length === 0) {
				continue
			}
			data.push(...eventsData)
		}

		drawTable(['eventsName', ...getNamesFormatColumns(eventsColumns)], data)
	})

function drawTable(headColumns: string[], contractData: CellOptions[][]) {
	const table = new Table({
		head: ['contract', ...headColumns],
		style: { head: ['green'] },
	})
	table.push()
	contractData.forEach((item) => table.push(item))

	console.log(table.toString())
}

function getFunctionsData(
	contractInterface: Interface,
	contractName: string,
	showColumns: FunctionFormatColumns[]
) {
	const functionData: CellOptions[][] = []

	const totalFunctions = contractInterface.fragments.filter(
		(fragment) => fragment.type === 'function'
	).length

	contractInterface.forEachFunction((fnt, index) => {
		const actions: Record<FunctionFormatColumns, () => CellOptions> = {
			selector: () => ({ content: fnt.selector }),
			'sign:full': () => ({ content: fnt.format('full') }),
			'sign:json': () => ({ content: fnt.format('json') }),
			'sign:minimal': () => ({ content: fnt.format('minimal') }),
			'sign:sighash': () => ({ content: fnt.format('sighash') }),
		}
		const row: CellOptions[] =
			index === 0
				? [{ content: contractName, rowSpan: totalFunctions }]
				: []

		row.push({ content: fnt.name })
		row.push(...showColumns.map((column) => actions[column]()))
		functionData.push(row)
	})
	return functionData
}

function getEventsData(
	contractInterface: Interface,
	contractName: string,
	showColumns: EventsFormatColumns[]
) {
	const eventsData: CellOptions[][] = []

	const totalEvents = contractInterface.fragments.filter(
		(fragment) => fragment.type === 'event'
	).length

	contractInterface.forEachEvent((fnt, index) => {
		const actions: Record<EventsFormatColumns, () => CellOptions> = {
			topicHash: () => ({ content: fnt.topicHash }),
			'sign:full': () => ({ content: fnt.format('full') }),
			'sign:json': () => ({ content: fnt.format('json') }),
			'sign:minimal': () => ({ content: fnt.format('minimal') }),
			'sign:sighash': () => ({ content: fnt.format('sighash') }),
		}
		const row: CellOptions[] =
			index === 0 ? [{ content: contractName, rowSpan: totalEvents }] : []

		row.push({ content: fnt.name })
		row.push(...showColumns.map((column) => actions[column]()))

		eventsData.push(row)
	})
	return eventsData
}

async function getContractsConfig(hre: HardhatRuntimeEnvironment) {
	// Obtain config
	const excludeContractsConfig = hre.config.functionSign.exclude
	const functionsColumns = hre.config.functionSign.functionsColumns
	const eventsColumns = hre.config.functionSign.eventsColumns

	// Get contracts or throw error if not compiled
	const contractsData = await getContractsData(hre)

	return {
		contracts: excludeContracts(contractsData, excludeContractsConfig),
		functionsColumns,
		eventsColumns,
	}
}

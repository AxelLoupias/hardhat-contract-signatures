import { scope } from 'hardhat/config'
import '@nomicfoundation/hardhat-ethers'
import Table, { type CellOptions } from 'cli-table3'
import { type FormatColumns } from '../types/types'
import {
	getContractsData,
	getNamesFormatColumns,
	isContract,
	excludeContracts,
} from '../utils'
import {
	type Interface,
	type NamedFragment,
	id,
	type FragmentType,
} from 'ethers'
import { type HardhatRuntimeEnvironment } from 'hardhat/types'
import { DEFAULT_WIDTH_COLS } from '../consts'

const signature = scope(
	'signature',
	'Display different signatures that have the methods, events and errors of your contracts by console'
)

signature
	.task(
		'functions',
		'Displays the signatures of the smart contract functions'
	)
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
			const functionData = getDataSignature({
				contractInterface,
				contractName: contractData.name,
				typeAllowed: ['function'],
				showColumns: functionsColumns,
			})
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
	.task('events', 'Displays the signatures of the smart contract events')
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
			const eventsData = getDataSignature({
				contractInterface,
				contractName: contractData.name,
				typeAllowed: ['event'],
				showColumns: eventsColumns,
			})
			if (eventsData.length === 0) {
				continue
			}
			data.push(...eventsData)
		}

		drawTable(['eventName', ...getNamesFormatColumns(eventsColumns)], data)
	})

signature
	.task('errors', 'Displays the signatures of the smart contract errors')
	.setAction(async (args, hre) => {
		const { contracts, errorsColumns } = await getContractsConfig(hre)
		const data = []
		for (const contractData of contracts) {
			if (!(await isContract(hre, contractData.name))) {
				continue
			}
			const contractInterface = (
				await hre.ethers.getContractFactory(contractData.name)
			).interface
			const eventsData = getDataSignature({
				contractInterface,
				contractName: contractData.name,
				typeAllowed: ['error'],
				showColumns: errorsColumns,
			})
			if (eventsData.length === 0) {
				continue
			}
			data.push(...eventsData)
		}

		drawTable(['errorName', ...getNamesFormatColumns(errorsColumns)], data)
	})

signature
	.task('find', 'Find the signature by selector')
	.addPositionalParam('find')
	.setAction(async (args, hre) => {
		const { find } = args
		const { contracts, findColumns } = await getContractsConfig(hre)
		const data = []
		for (const contractData of contracts) {
			if (!(await isContract(hre, contractData.name))) {
				continue
			}
			const contractInterface = (
				await hre.ethers.getContractFactory(contractData.name)
			).interface
			const functionData = getDataSignature({
				contractInterface,
				contractName: contractData.name,
				find,
				typeAllowed: ['error', 'event', 'function'],
				showColumns: findColumns,
			})
			if (functionData.length === 0) {
				continue
			}
			data.push(...functionData)
		}

		drawTable(['name', ...getNamesFormatColumns(findColumns)], data)
	})

function calculateColumnWidths(
	maxWidth: number,
	headColumnCount: number
): number[] {
	const widthUsed =
		DEFAULT_WIDTH_COLS + DEFAULT_WIDTH_COLS + headColumnCount + 3
	const remainingWidth = maxWidth - widthUsed
	const columnWidth = Math.floor(remainingWidth / headColumnCount)
	const colWidths = new Array(headColumnCount).fill(columnWidth)
	colWidths[0] += remainingWidth % headColumnCount

	return colWidths
}

function drawTable(headColumns: string[], contractData: CellOptions[][]) {
	const maxWidth = process.stdout.columns ?? 400

	const table = new Table({
		head: ['contract', ...headColumns],
		style: { head: ['green'] },
		wordWrap: true,
		wrapOnWordBoundary: false,
		colWidths: [
			DEFAULT_WIDTH_COLS,
			DEFAULT_WIDTH_COLS,
			...calculateColumnWidths(maxWidth, headColumns.length - 1),
		],
	})
	table.push()
	contractData.forEach((item) => table.push(item))

	console.log(table.toString())
}

function getDataSignature({
	contractInterface,
	contractName,
	typeAllowed,
	showColumns,
	find,
}: {
	contractInterface: Interface
	contractName: string
	typeAllowed: FragmentType[]
	showColumns: FormatColumns[]
	find?: string
}) {
	const isFinding = find !== undefined
	const data: CellOptions[][] = []
	const contractData = contractInterface.fragments.filter((item) =>
		typeAllowed.includes(item.type)
	)

	contractData.forEach((fnt, index) => {
		const actions: Record<FormatColumns, () => CellOptions> = {
			topicHash: () => ({ content: id(fnt.format('sighash')) }),
			selector: () => ({
				content: id(fnt.format('sighash')).substring(0, 10),
			}),
			'sign:full': () => ({ content: fnt.format('full') }),
			'sign:json': () => ({ content: fnt.format('json') }),
			'sign:minimal': () => ({ content: fnt.format('minimal') }),
			'sign:sighash': () => ({ content: fnt.format('sighash') }),
			type: () => ({ content: fnt.type }),
		}

		if (
			isFinding &&
			!actions.selector().content!.toString().includes(find) &&
			(fnt as NamedFragment).name !== find
		) {
			return
		}
		const row: CellOptions[] =
			index === 0 || isFinding
				? [
						{
							content: contractName,
							rowSpan: !isFinding ? contractData.length : 0,
						},
					]
				: []

		row.push({ content: (fnt as NamedFragment).name })
		row.push(...showColumns.map((column) => actions[column]()))

		data.push(row)
	})

	return data
}

async function getContractsConfig(hre: HardhatRuntimeEnvironment) {
	// Obtain config
	const excludeContractsConfig = hre.config.contractSignature.exclude
	const functionsColumns = hre.config.contractSignature.functionsColumns
	const eventsColumns = hre.config.contractSignature.eventsColumns
	const errorsColumns = hre.config.contractSignature.errorsColumns
	const findColumns = hre.config.contractSignature.findColumns

	await hre.run('compile')
	const contractsData = await getContractsData(hre)

	return {
		contracts: excludeContracts(contractsData, excludeContractsConfig),
		functionsColumns,
		eventsColumns,
		errorsColumns,
		findColumns,
	}
}

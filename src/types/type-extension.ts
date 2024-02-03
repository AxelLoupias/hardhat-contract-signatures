import 'hardhat/types/config'
import {
	type FunctionFormatColumns,
	type DeepPartial,
	type EventsFormatColumns,
	type ErrorFormatColumns,
	type FormatColumns,
} from './types'

// TODO add customs columns with callback
export interface ContractSignature {
	exclude: string[]
	functionsColumns: FunctionFormatColumns[]
	eventsColumns: EventsFormatColumns[]
	errorsColumns: ErrorFormatColumns[]
	findColumns: FormatColumns[]
}

declare module 'hardhat/types/config' {
	export interface HardhatUserConfig {
		contractSignature?: DeepPartial<ContractSignature>
	}

	export interface HardhatConfig {
		contractSignature: Required<ContractSignature>
	}
}

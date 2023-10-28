import 'hardhat/types/config'
import {
	type FunctionFormatColumns,
	type DeepPartial,
	type EventsFormatColumns,
	type ErrorFormatColumns,
} from './types'

export interface ContractSignature {
	exclude: string[]
	functionsColumns: FunctionFormatColumns[]
	eventsColumns: EventsFormatColumns[]
	errorsColumns: ErrorFormatColumns[]
}

declare module 'hardhat/types/config' {
	export interface HardhatUserConfig {
		contractSignature?: DeepPartial<ContractSignature>
	}

	export interface HardhatConfig {
		contractSignature: Required<ContractSignature>
	}
}

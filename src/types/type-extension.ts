import 'hardhat/types/config'
import {
	type FunctionFormatColumns,
	type DeepPartial,
	type EventsFormatColumns,
} from './types'

export interface FunctionSign {
	exclude: string[]
	functionsColumns: FunctionFormatColumns[]
	eventsColumns: EventsFormatColumns[]
}

declare module 'hardhat/types/config' {
	export interface HardhatUserConfig {
		functionSign?: DeepPartial<FunctionSign>
	}

	export interface HardhatConfig {
		functionSign: Required<FunctionSign>
	}
}

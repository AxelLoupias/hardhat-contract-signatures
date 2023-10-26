type FormatFragments =
	| 'sign:minimal'
	| 'sign:sighash'
	| 'sign:full'
	| 'sign:json'

export type FunctionFormatColumns = 'selector' | FormatFragments

export type ErrorFormatColumns = 'selector' | FormatFragments

export type EventsFormatColumns = 'topicHash' | FormatFragments

export type FormatColumns =
	| FunctionFormatColumns
	| EventsFormatColumns
	| ErrorFormatColumns

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface ContractArtifactData {
	name: string
	path: string
}

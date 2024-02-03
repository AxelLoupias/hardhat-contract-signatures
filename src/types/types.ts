type FormatFragments =
	| 'selector'
	| 'sign:minimal'
	| 'sign:sighash'
	| 'sign:full'
	| 'sign:json'
	| 'type'

export type FunctionFormatColumns = FormatFragments

export type ErrorFormatColumns = FormatFragments

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

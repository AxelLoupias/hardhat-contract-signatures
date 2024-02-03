import { type FormatColumns } from './types/types'

export const PLUGIN_NAME = 'FUNCTION SIGN'

export const COLUMNS_NAMES: Record<FormatColumns, string> = {
	selector: 'selector',
	'sign:minimal': 'sign',
	'sign:sighash': 'sighash',
	'sign:full': 'full',
	'sign:json': 'json',
	topicHash: 'topicHash',
	type: 'type',
}

export const DEFAULT_WIDTH_COLS = 30

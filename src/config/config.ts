import { extendConfig } from 'hardhat/config'
import { type HardhatConfig, type HardhatUserConfig } from 'hardhat/types'
import { type FunctionSign } from '../types/type-extension'

extendConfig(
	(config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
		const defaultValues: FunctionSign = {
			functionsColumns: ['selector', 'sign:minimal'],
			eventsColumns: ['topicHash'],
			exclude: [],
		}

		config.functionSign = Object.assign(
			defaultValues,
			userConfig.functionSign
		)
	}
)

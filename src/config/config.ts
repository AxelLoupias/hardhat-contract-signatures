import { extendConfig } from 'hardhat/config'
import { type HardhatConfig, type HardhatUserConfig } from 'hardhat/types'
import { type ContractSignature } from '../types/type-extension'

extendConfig(
	(config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
		const defaultValues: ContractSignature = {
			functionsColumns: ['selector', 'sign:minimal'],
			eventsColumns: ['topicHash'],
			errorsColumns: ['selector', 'sign:minimal'],
			findColumns: ['type', 'sign:minimal'],
			exclude: [],
		}

		config.contractSignature = Object.assign(
			defaultValues,
			userConfig.contractSignature
		)
	}
)

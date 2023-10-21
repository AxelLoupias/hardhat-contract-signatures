import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'tsconfig-paths/register'

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.18',
		settings: {
			optimizer: {
				enabled: true,
				runs: 100,
			},
		},
	},
	mocha: {
		timeout: 1000000,
	},
	// @ts-expect-error Bug hardhat types
	typechain: {
		outDir: './typechain',
	},
}

export default config

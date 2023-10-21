# Hardhat-starter

## Description

This is a starter project for Hardhat, an Ethereum development environment. The project includes sample scripts and configuration files that enable you to compile, lint, and test your Solidity smart contracts.

## Usage

### Installation

1. Clone the repository: `git clone https://github.com/Axel801/hardhat-starter`
2. Install the dependencies: `npm install`

### Running Scripts

- `npm run test`: Runs the Hardhat tests.
- `npm run compile`: Compiles the Solidity files in the `contracts/` directory.
- `npm run compile:force`: Compiles the Solidity files in the `contracts/` directory, even if they haven't changed.
- `npm run solhint`: Lints the Solidity files in the `contracts/` directory using Solhint.
- `npm run prettier`: Automatically formats the TypeScript, JavaScript, and Solidity files according to the Prettier configuration.
- `npm run lint`: Lints the TypeScript and JavaScript files using ESLint.
- `npm run coverage`: Creates a coverage report for your Smart Contract tests

### Dependencies

- [@nomicfoundation/hardhat-toolbox](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-toolbox): A collection of Hardhat plugins and tasks.
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin): A plugin that provides TypeScript-specific linting rules for ESLint.
- [eslint](https://github.com/eslint/eslint): A pluggable linting utility for JavaScript and JavaScript-based languages.
- [eslint-config-standard-with-typescript](https://github.com/xjamundx/eslint-config-standard-with-typescript): An ESLint shareable config that extends the [eslint-config-standard](https://github.com/standard/eslint-config-standard) module with TypeScript support.
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import): ESLint plugin for linting and fixing import/export syntax.
- [eslint-plugin-n](https://github.com/bahmutov/eslint-plugin-n): Custom rules for ESLint.
- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise): ESLint plugin for Promises.
- [hardhat](https://github.com/nomiclabs/hardhat): A development environment for Ethereum.
- [prettier](https://github.com/prettier/prettier): An opinionated code formatter.
- [prettier-plugin-solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): A Prettier plugin for Solidity.
- [solhint](https://github.com/protofire/solhint): A linter for Solidity.
- [solhint-plugin-prettier](https://github.com/protofire/solhint/tree/master/packages/solhint-plugin-prettier): A plugin for Solhint which uses Prettier to format the source code.
- [typescript](https://github.com/Microsoft/TypeScript): A superset of JavaScript that adds optional static typing. 

## License

This project is licensed under the ISC License.
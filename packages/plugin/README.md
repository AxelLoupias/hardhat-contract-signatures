# Hardhat Contract Signatures

This plugin for Hardhat display different signatures that have the methods, events and errors of your contracts by console.

## Installation

```bash
npm install --save-dev hardhat-contract-signatures
# or with pnpm
pnpm add -D hardhat-contract-signatures
# or with yarn
yarn add -D hardhat-contract-signatures
```

## Configuration

Load plugin in your `hardhat.config`:

```javascript
import hardhatContractSignatures from "hardhat-contract-signatures";

const config: HardhatUserConfig = {
  plugins: [
    hardhatContractSignatures,
  ],
  contractSignature: {
		... // see table for configuration options
		functionsColumns: ['selector',],
		eventsColumns: ['topicHash'],
		exclude: ['contracts/testWrappers/**', '@openzeppelin/**'],
	}
};
```

Add configuration for `contractSignature` key:
| Option | Description | DefaultValues |
|------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| exclude | Array of dependency paths to exclude | [] |
| functionsColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type` | ['selector', 'sign:minimal'] |
| eventsColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`,`topicHash` | ['topicHash'] |
| errorsColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type` | ['selector', 'sign:minimal'] |
| findColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`,,`topicHash`| ['type', 'sign:minimal'] |

## How it modifies Hardhat’s behavior

This plugin uses configuration hooks to extend Hardhat's configuration with contract signature settings. It does not override any existing tasks but adds new ones under the `signature` namespace.

## Usage

The plugin includes 3 tasks depending on which signature you want to obtain:

- Functions:
  ```
  npx hardhat signature functions
  ```
- Errors:
  ```
  npx hardhat signature errors
  ```
- Events:
  ```
  npx hardhat signature events
  ```
- Find:
  ```
  npx hardhat signature find {selector or name you want to find}
  ```

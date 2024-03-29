# Hardhat Contract Signatures

This plugin for Hardhat display different signatures that have the methods, events and errors of your contracts by console.

## Installation
```bash
npm install --save-dev hardhat-contract-signatures
```

## Configuration
Load plugin in your `hardhat.config`:
```javascript
// JS
require("hardhat-contract-signatures");
// TS
import "hardhat-contract-signatures"
```

Add configuration for `contractSignature` key:
| Option           | Description                                                                                                                   | DefaultValues                |
|------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| exclude          | Array of dependency paths to exclude                                                                                          | []                           |
| functionsColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`             | ['selector', 'sign:minimal'] |
| eventsColumns    | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`,`topicHash` | ['topicHash']                |
| errorsColumns    | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`             | ['selector', 'sign:minimal'] |
| findColumns      | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`,,`topicHash`| ['type', 'sign:minimal'] |

```javascript
contractSignature: {
	functionsColumns: ['selector',],
	eventsColumns: ['topicHash'],
	exclude: ['contracts/testWrappers/**', '@openzeppelin/**'],
}
```

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

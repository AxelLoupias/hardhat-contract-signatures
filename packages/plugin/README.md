# Hardhat Contract Signatures

A Hardhat plugin that displays function selectors, event topic hashes, and error selectors for your smart contracts. This plugin helps you inspect and find contract signatures (methods, events, and errors) directly from the command line, making it easier to debug and interact with your contracts.

## Installation

This plugin requires `hardhat` (v3.0.6 or higher) and `viem` (v2.38.4 or higher) as peer dependencies.

Install the plugin and its peer dependencies:

```bash
npm install --save-dev hardhat-contract-signatures viem
# or with pnpm
pnpm add -D hardhat-contract-signatures viem
# or with yarn
yarn add -D hardhat-contract-signatures viem
```

**Note for Yarn users:** Yarn doesn't automatically install peer dependencies. Make sure to install `viem` alongside this plugin as shown above.

## Configuration

Load the plugin in your `hardhat.config`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import hardhatContractSignatures from "hardhat-contract-signatures";

const config: HardhatUserConfig = {
  plugins: [hardhatContractSignatures],
  contractSignature: {
    // See table below for configuration options
    functionsColumns: ["selector"],
    eventsColumns: ["topicHash"],
    exclude: ["contracts/testWrappers/**", "@openzeppelin/**"],
  },
};

export default config;
```

### Configuration Options

Add configuration for the `contractSignature` key:
| Option | Description | DefaultValues |
|------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| exclude | Array of dependency paths to exclude | [] |
| functionsColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type` | ['selector', 'sign:minimal'] |
| eventsColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`,`topicHash` | ['topicHash'] |
| errorsColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type` | ['selector', 'sign:minimal'] |
| findColumns | Array of the columns you want to display. `sign:minimal`,`sign:sighash`,`sign:full`,`sign:json`,`selector`,`type`,,`topicHash`| ['type', 'sign:minimal'] |

## How it modifies Hardhat's behavior

This plugin extends Hardhat's functionality by:

- **Adding new tasks:** Creates tasks under the `signature` namespace (`signature functions`, `signature errors`, `signature events`, `signature find <selector_or_name>`)
- **Extending configuration:** Adds a new `contractSignature` configuration section to your Hardhat config

The plugin only activates when you explicitly run one of its tasks.

## Tasks

The plugin adds the following tasks to your Hardhat environment:

### `signature functions`

Displays function selectors for all contract functions.

```bash
npx hardhat signature functions
```

### `signature errors`

Displays error selectors for all contract errors.

```bash
npx hardhat signature errors
```

### `signature events`

Displays event topic hashes for all contract events.

```bash
npx hardhat signature events
```

### `signature find`

Finds and displays information about a specific selector, topic hash, or signature name.

```bash
npx hardhat signature find <selector_or_name>
```

**Example:**

```bash
# Find by function selector
npx hardhat signature find 0xa9059cbb

# Find by name
npx hardhat signature find transfer
```

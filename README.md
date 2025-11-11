# Hardhat Contract Signatures

This repository contains the Hardhat plugin for displaying contract signatures.

## Plugin Documentation

For detailed documentation, installation instructions, and usage, see the [plugin README](./packages/plugin/README.md).

## Packages

- [Plugin](./packages/plugin/) - The main Hardhat plugin.
- [Example Project](./packages/example-project/) - An example project demonstrating the plugin usage.

## Development

This is a monorepo managed with pnpm workspaces.

To install dependencies:

```bash
pnpm install
```

To build the plugin:

```bash
cd packages/plugin
pnpm build
```

To run tests:

```bash
cd packages/plugin
pnpm test
```

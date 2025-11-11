import { describe, it } from "node:test";

import assert from "node:assert/strict";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types/config";
import { resolvePluginConfig, validatePluginConfig } from "../src/config.js";
import { ContractSignature } from "../src/types.js";

describe("Contract Signature Plugin config", () => {
  describe("Config validation", () => {
    describe("Valid cases", () => {
      it("Should consider an empty config as valid", async () => {
        const validationErrors = await validatePluginConfig({});

        assert.equal(validationErrors.length, 0);
      });

      it("Should ignore errors in other parts of the config", async () => {
        const validationErrors = await validatePluginConfig({
          networks: {
            foo: {
              type: "http",
              url: "INVALID URL",
            },
          },
        });

        assert.equal(validationErrors.length, 0);
      });

      it("Should accept an empty contractSignature object", async () => {
        const validationErrors = await validatePluginConfig({
          contractSignature: {},
        });

        assert.equal(validationErrors.length, 0);
      });

      it("Should accept a contractSignature with valid columns", async () => {
        const validationErrors = await validatePluginConfig({
          contractSignature: {
            functionsColumns: ["selector", "sign:minimal"],
            eventsColumns: ["topicHash"],
            errorsColumns: ["selector"],
            findColumns: ["type", "sign:full"],
            exclude: ["SomeContract"],
          },
        });

        assert.equal(validationErrors.length, 0);
      });
    });

  });

  describe("Config resolution", () => {
    const defaultContractSignature: ContractSignature = {
      functionsColumns: ["selector", "sign:minimal"],
      eventsColumns: ["topicHash"],
      errorsColumns: ["selector", "sign:minimal"],
      findColumns: ["type", "sign:minimal"],
      exclude: [],
    };

    it("Should resolve a config without a contractSignature field", async () => {
      const userConfig: HardhatUserConfig = {};
      const partiallyResolvedConfig = {} as HardhatConfig;

      const resolvedConfig = await resolvePluginConfig(
        userConfig,
        partiallyResolvedConfig,
      );

      assert.deepEqual(
        resolvedConfig.contractSignature,
        defaultContractSignature,
      );
    });

    it("Should resolve a config with an empty contractSignature field", async () => {
      const userConfig: HardhatUserConfig = { contractSignature: {} };
      const partiallyResolvedConfig = {} as HardhatConfig;

      const resolvedConfig = await resolvePluginConfig(
        userConfig,
        partiallyResolvedConfig,
      );

      assert.deepEqual(
        resolvedConfig.contractSignature,
        defaultContractSignature,
      );
    });

    it("Should resolve a config merging provided contractSignature with defaults", async () => {
      const userConfig: HardhatUserConfig = {
        contractSignature: {
          functionsColumns: ["sign:full"],
          exclude: ["TestContract"],
        },
      };
      const partiallyResolvedConfig = {} as HardhatConfig;

      const resolvedConfig = await resolvePluginConfig(
        userConfig,
        partiallyResolvedConfig,
      );

      assert.deepEqual(resolvedConfig.contractSignature, {
        ...defaultContractSignature,
        functionsColumns: ["sign:full"],
        exclude: ["TestContract"],
      });
    });
  });
});

import { HardhatUserConfig } from "hardhat/config";
import { HardhatConfig } from "hardhat/types/config";
import { HardhatUserConfigValidationError } from "hardhat/types/hooks";
import type { ConfigHooks } from "hardhat/types/hooks";
import { ContractSignature } from "./types.js";

export async function validatePluginConfig(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userConfig: HardhatUserConfig,
): Promise<HardhatUserConfigValidationError[]> {
  return [];
}

export async function resolvePluginConfig(
  userConfig: HardhatUserConfig,
  partiallyResolvedConfig: HardhatConfig,
): Promise<HardhatConfig> {
  const defaultValues: ContractSignature = {
    functionsColumns: ["selector", "sign:minimal"],
    eventsColumns: ["topicHash"],
    errorsColumns: ["selector", "sign:minimal"],
    findColumns: ["type", "sign:minimal"],
    exclude: [],
  };

  const contractSignature: ContractSignature = {
    ...defaultValues,
    ...userConfig.contractSignature,
  };

  return {
    ...partiallyResolvedConfig,
    contractSignature,
  };
}

export default async (): Promise<Partial<ConfigHooks>> => {
  const handlers: Partial<ConfigHooks> = {
    async validateUserConfig(userConfig) {
      return validatePluginConfig(userConfig);
    },
    async resolveUserConfig(userConfig, resolveConfigurationVariable, next) {
      const partiallyResolvedConfig = await next(
        userConfig,
        resolveConfigurationVariable,
      );

      return resolvePluginConfig(userConfig, partiallyResolvedConfig);
    },
  };

  return handlers;
};

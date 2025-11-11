import { DeepPartial, ContractSignature } from "./types.js";

import "hardhat/types/config";
declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    contractSignature?: DeepPartial<ContractSignature>;
  }

  interface HardhatConfig {
    contractSignature: Required<ContractSignature>;
  }
}

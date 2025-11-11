import { HardhatUserConfig } from "hardhat/config";
import hardhatContractSignatures from "../../../src/index.js";

const config: HardhatUserConfig = {
  plugins: [hardhatContractSignatures],
  solidity: {
    compilers: [
      {
        version: "0.8.28",
      },
    ],
  },
};

export default config;

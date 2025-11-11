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
  contractSignature: {
    functionsColumns: ["selector", "sign:full", "sign:minimal"],
    eventsColumns: ["topicHash", "sign:full", "sign:minimal"],
    errorsColumns: ["selector", "sign:full", "sign:minimal"],
    findColumns: ["type", "selector", "sign:minimal"],
  },
};

export default config;

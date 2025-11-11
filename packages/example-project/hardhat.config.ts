import { HardhatUserConfig } from "hardhat/config";
import hardhatContractSignatures from "hardhat-contract-signatures";

export default {
  plugins: [hardhatContractSignatures],
  solidity: "0.8.29",
  contractSignature: {
    functionsColumns: ["selector", "sign:full", "sign:minimal"],
    eventsColumns: ["selector", "sign:full", "sign:minimal"],
    errorsColumns: ["selector", "sign:full", "sign:minimal"],
  },
} satisfies HardhatUserConfig;

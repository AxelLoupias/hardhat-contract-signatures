import { emptyTask, task } from "hardhat/config";
import type { HardhatPlugin } from "hardhat/types/plugins";
import "./type-extensions.js";

const plugin: HardhatPlugin = {
  id: "hardhat-contract-signatures",
  hookHandlers: {
    config: () => import("./config.js"),
  },
  tasks: [
    emptyTask(
      "signature",
      "Displays the signature of the smart contract",
    ).build(),
    task(
      ["signature", "functions"],
      "Displays the signatures of the smart contract functions",
    )
      .setAction(() => import("./tasks/functions.js"))
      .build(),
    task(
      ["signature", "events"],
      "Displays the signatures of the smart contract events",
    )
      .setAction(() => import("./tasks/events.js"))
      .build(),
    task(
      ["signature", "errors"],
      "Displays the signatures of the smart contract errors",
    )
      .setAction(() => import("./tasks/errors.js"))
      .build(),
    task(["signature", "find"], "Find the signature by selector or name")
      .addPositionalArgument({
        name: "find",
        description: "The selector or name to search for",
      })
      .setAction(() => import("./tasks/find.js"))
      .build(),
  ],
};

export default plugin;

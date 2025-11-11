import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { executeSignatureTask, TASK_CONFIGS } from "./signature-task.js";

export default async function (
  taskArguments: unknown,
  hre: HardhatRuntimeEnvironment,
) {
  await executeSignatureTask(taskArguments, hre, TASK_CONFIGS.errors);
}

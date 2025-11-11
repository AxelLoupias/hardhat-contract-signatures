import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

interface FindResultJson {
  contract: string;
  name: string;
  type: "function" | "event" | "error";
  selector?: string;
  sign?: string;
  full?: string;
}

describe("signature find tests", () => {
  let hre: HardhatRuntimeEnvironment;
  let consoleOutput: string[] = [];
  let originalConsoleLog: typeof console.log;

  const getJsonOutput = (): FindResultJson[] => {
    const output = consoleOutput.join("\n");
    const jsonStartIndex = output.indexOf("[");
    if (jsonStartIndex === -1) return [];
    const jsonString = output.substring(jsonStartIndex);
    return JSON.parse(jsonString) as FindResultJson[];
  };

  beforeEach(async () => {
    hre = await createFixtureProjectHRE("base-project");
    consoleOutput = [];

    // Capture console.log output
    originalConsoleLog = console.log;
    console.log = (...args: unknown[]) => {
      consoleOutput.push(args.map(String).join(" "));
    };
  });

  afterEach(() => {
    // Restore console.log
    console.log = originalConsoleLog;
  });

  describe("Task definition", () => {
    it("Should define signature:find task", async () => {
      const findTask = hre.tasks.getTask(["signature", "find"]);
      assert.notEqual(
        findTask,
        undefined,
        "signature:find task should be defined",
      );
    });

    it("Should have correct description", async () => {
      const findTask = hre.tasks.getTask(["signature", "find"]);
      assert.equal(
        findTask.description,
        "Find the signature by selector or name",
      );
    });
  });

  describe("Task execution", () => {
    describe("Search by function name", () => {
      it("Should find function by exact name with JSON output", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "add", json: true });

        const jsonOutput = getJsonOutput();
        const addFunction = jsonOutput.find(
          (item) => item.contract === "TestContract" && item.name === "add",
        );

        assert.ok(addFunction, "Should find add function");
        assert.equal(addFunction?.type, "function", "Should be a function");
        assert.ok(
          addFunction?.sign?.includes("add(uint256,uint256)"),
          "Should include function signature",
        );
      });

      it("Should find function by partial name with JSON output", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "transfer", json: true });

        const jsonOutput = getJsonOutput();
        const transferFunction = jsonOutput.find(
          (item) =>
            item.contract === "TestContract" && item.name === "transfer",
        );

        assert.ok(transferFunction, "Should find transfer function");
        assert.equal(
          transferFunction?.type,
          "function",
          "Should be a function",
        );
      });
    });

    describe("Search by function selector", () => {
      it("Should find function by selector with JSON output", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        // add(uint256,uint256) selector
        await findTask.run({ find: "0x771602f7", json: true });

        const jsonOutput = getJsonOutput();
        const addFunction = jsonOutput.find(
          (item) => item.contract === "TestContract" && item.name === "add",
        );

        assert.ok(addFunction, "Should find add function");
        assert.ok(
          addFunction?.selector?.includes("0x771602f7"),
          "Should include selector",
        );
        assert.ok(
          addFunction?.sign?.includes("add(uint256,uint256)"),
          "Should include function signature",
        );
      });

      it("Should find function by another selector with JSON output", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        // transfer(address,uint256) selector
        await findTask.run({ find: "0xa9059cbb", json: true });

        const jsonOutput = getJsonOutput();
        const transferFunction = jsonOutput.find(
          (item) =>
            item.contract === "TestContract" && item.name === "transfer",
        );

        assert.ok(transferFunction, "Should find transfer function");
        assert.ok(
          transferFunction?.selector?.includes("0xa9059cbb"),
          "Should include selector",
        );
      });
    });

    describe("Search by event name", () => {
      it("Should find event by name with JSON output", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "Transfer", json: true });

        const jsonOutput = getJsonOutput();
        const transferEvent = jsonOutput.find(
          (item) =>
            item.contract === "TestContract" && item.name === "Transfer",
        );

        assert.ok(transferEvent, "Should find Transfer event");
        assert.equal(transferEvent?.type, "event", "Should be an event");
        assert.ok(
          transferEvent?.sign?.includes("Transfer") &&
            transferEvent?.sign?.includes("address") &&
            transferEvent?.sign?.includes("uint256"),
          "Should include event signature with types",
        );
      });
    });

    describe("Search by error selector", () => {
      it("Should find error by selector with JSON output", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        // InsufficientBalance(uint256,uint256) selector
        await findTask.run({ find: "0xcf479181", json: true });

        const jsonOutput = getJsonOutput();
        const insufficientError = jsonOutput.find(
          (item) =>
            item.contract === "TestContract" &&
            item.name === "InsufficientBalance",
        );

        assert.ok(insufficientError, "Should find InsufficientBalance error");
        assert.equal(insufficientError?.type, "error", "Should be an error");
        assert.ok(
          insufficientError?.selector?.includes("0xcf479181"),
          "Should include selector",
        );
        assert.ok(
          insufficientError?.sign?.includes("InsufficientBalance") &&
            insufficientError?.sign?.includes("uint256"),
          "Should include error signature with types",
        );
      });
    });

    describe("No results", () => {
      it("Should handle search with no results", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "nonExistentFunction", json: true });

        const jsonOutput = getJsonOutput();
        assert.equal(jsonOutput.length, 0, "Should have no results");
      });
    });
  });
});

import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

describe("signature find tests", () => {
  let hre: HardhatRuntimeEnvironment;
  let consoleOutput: string[] = [];
  let originalConsoleLog: typeof console.log;
  let originalStdoutColumns: number | undefined;

  beforeEach(async () => {
    hre = await createFixtureProjectHRE("base-project");
    consoleOutput = [];

    // Mock terminal width to avoid size issues
    originalStdoutColumns = process.stdout.columns;
    Object.defineProperty(process.stdout, "columns", {
      value: 200,
      writable: true,
      configurable: true,
    });

    // Capture console.log output
    originalConsoleLog = console.log;
    console.log = (...args: unknown[]) => {
      consoleOutput.push(args.map(String).join(" "));
    };
  });

  afterEach(() => {
    // Restore console.log
    console.log = originalConsoleLog;

    // Restore terminal width
    Object.defineProperty(process.stdout, "columns", {
      value: originalStdoutColumns,
      writable: true,
      configurable: true,
    });
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
      it("Should find function by exact name", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "inc" });

        const output = consoleOutput.join("\n");

        assert.ok(
          output.includes("Counter"),
          "Should display Counter contract",
        );
        assert.ok(output.includes("inc"), "Should display inc function");
        assert.ok(output.includes("function"), "Should display function type");
        assert.ok(
          output.includes("inc()"),
          "Should display function signature",
        );
      });

      it("Should find function by partial name", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "incBy" });

        const output = consoleOutput.join("\n");

        assert.ok(
          output.includes("Counter"),
          "Should display Counter contract",
        );
        assert.ok(output.includes("incBy"), "Should display incBy function");
        assert.ok(output.includes("function"), "Should display function type");
      });
    });

    describe("Search by function selector", () => {
      it("Should find function by selector", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "0x371303c0" });

        const output = consoleOutput.join("\n");

        assert.ok(
          output.includes("Counter"),
          "Should display Counter contract",
        );
        assert.ok(output.includes("inc"), "Should display inc function");
        assert.ok(output.includes("function"), "Should display function type");
        assert.ok(
          output.includes("inc()"),
          "Should display function signature",
        );
      });

      it("Should find function by another selector", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "0x70119d06" });

        const output = consoleOutput.join("\n");

        assert.ok(output.includes("incBy"), "Should display incBy function");
      });
    });

    describe("Search by event name", () => {
      it("Should find event by name", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "Increment" });

        const output = consoleOutput.join("\n");

        assert.ok(
          output.includes("Counter"),
          "Should display Counter contract",
        );
        assert.ok(
          output.includes("Increment"),
          "Should display Increment event",
        );
        assert.ok(output.includes("event"), "Should display event type");
        assert.ok(
          output.includes("Increment(uint256)"),
          "Should display event signature",
        );
      });
    });

    describe("Search by error selector", () => {
      it("Should find error by selector", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "0xcff5da22" });

        const output = consoleOutput.join("\n");

        assert.ok(
          output.includes("Counter"),
          "Should display Counter contract",
        );
        assert.ok(
          output.includes("MaxValueReached"),
          "Should display MaxValueReached error",
        );
        assert.ok(output.includes("error"), "Should display error type");
        assert.ok(
          output.includes("MaxValueReached(uint256,uint256)"),
          "Should display error signature",
        );
      });
    });

    describe("Table structure", () => {
      it("Should display correct column headers", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "inc" });

        const output = consoleOutput.join("\n");

        // Verify table structure
        assert.ok(
          output.includes("contract"),
          "Should have contract column header",
        );
        assert.ok(output.includes("name"), "Should have name column header");
        assert.ok(output.includes("type"), "Should have type column header");
        assert.ok(output.includes("sign"), "Should have sign column header");
      });
    });

    describe("No results", () => {
      it("Should handle search with no results", async () => {
        const findTask = hre.tasks.getTask(["signature", "find"]);

        await findTask.run({ find: "nonExistentFunction" });

        const output = consoleOutput.join("\n");

        assert.ok(
          output.includes("contract"),
          "Should still display table headers",
        );
        const lines = output.split("\n");
        const dataLines = lines.filter(
          (line) =>
            line.includes("│") &&
            !line.includes("contract") &&
            !line.includes("┌") &&
            !line.includes("└") &&
            !line.includes("├"),
        );
        assert.equal(dataLines.length, 0, "Should have no data rows");
      });
    });
  });
});

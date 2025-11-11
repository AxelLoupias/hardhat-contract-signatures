import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

describe("signature functions tests", () => {
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
    it("Should define signature:functions task", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      assert.notEqual(
        functionsTask,
        undefined,
        "signature:functions task should be defined",
      );
    });

    it("Should have correct description", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      assert.equal(
        functionsTask.description,
        "Displays the signatures of the smart contract functions",
      );
    });
  });

  describe("Task execution", () => {
    it("Should compile and display function signatures", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);

      await functionsTask.run();

      const output = consoleOutput.join("\n");

      // Verify that the output contains expected function signatures
      assert.ok(output.includes("Counter"), "Should display Counter contract");
      assert.ok(output.includes("inc"), "Should display inc() function");
      assert.ok(
        output.includes("incBy"),
        "Should display incBy(uint) function",
      );
      assert.ok(output.includes("x"), "Should display x() function");
    });

    it("Should display function selectors", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);

      await functionsTask.run();

      const output = consoleOutput.join("\n");

      // Check for known selectors
      assert.ok(
        output.includes("0x371303c0"),
        "Should display selector for inc()",
      );
      assert.ok(
        output.includes("0x70119d06"),
        "Should display selector for incBy(uint)",
      );
      assert.ok(
        output.includes("0x0c55699c"),
        "Should display selector for x()",
      );
    });

    it("Should display contract names and function names", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);

      await functionsTask.run();

      const output = consoleOutput.join("\n");

      // Verify table structure
      assert.ok(
        output.includes("contract"),
        "Should have contract column header",
      );
      assert.ok(
        output.includes("functionName"),
        "Should have functionName column header",
      );
      assert.ok(
        output.includes("selector"),
        "Should have selector column header",
      );
    });

    it("Should display table with proper formatting", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);

      await functionsTask.run();

      const output = consoleOutput.join("\n");

      // Check for table characters
      assert.ok(output.includes("┌"), "Should have table border characters");
      assert.ok(output.includes("│"), "Should have table column separators");
      assert.ok(output.includes("└"), "Should have table border characters");
    });

    it("Should only display functions (not events or errors)", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);

      await functionsTask.run();

      const output = consoleOutput.join("\n");

      // Should not include events
      assert.ok(
        !output.includes("Increment"),
        "Should not display event Increment",
      );

      // Should not include errors
      assert.ok(
        !output.includes("MaxValueReached"),
        "Should not display error MaxValueReached",
      );
    });
  });

  describe("Multiple contracts", () => {
    it("Should display functions from Counter contract", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);

      await functionsTask.run();

      const output = consoleOutput.join("\n");

      // Should display Counter contract and its functions
      assert.ok(output.includes("Counter"), "Should display Counter contract");
      assert.ok(output.includes("inc"), "Should display inc function");
      assert.ok(output.includes("incBy"), "Should display incBy function");
      assert.ok(output.includes("x"), "Should display x function");
    });
  });
});

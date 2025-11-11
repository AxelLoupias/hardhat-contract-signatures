import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

describe("signature errors tests", () => {
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
    it("Should define signature:errors task", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      assert.notEqual(
        errorsTask,
        undefined,
        "signature:errors task should be defined",
      );
    });

    it("Should have correct description", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      assert.equal(
        errorsTask.description,
        "Displays the signatures of the smart contract errors",
      );
    });
  });

  describe("Task execution", () => {
    it("Should compile and display error signatures", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);

      await errorsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(output.includes("Counter"), "Should display Counter contract");
      assert.ok(
        output.includes("MaxValueReached"),
        "Should display MaxValueReached error",
      );
    });

    it("Should display error selectors", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);

      await errorsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(
        output.includes("0xcff5da22"),
        "Should display selector for MaxValueReached",
      );
    });

    it("Should display contract names and error names", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);

      await errorsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(
        output.includes("contract"),
        "Should have contract column header",
      );
      assert.ok(
        output.includes("errorName"),
        "Should have errorName column header",
      );
      assert.ok(
        output.includes("selector"),
        "Should have selector column header",
      );
    });

    it("Should only display errors (not events or functions)", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);

      await errorsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(
        !output.includes("Increment"),
        "Should not display event Increment",
      );

      assert.ok(!output.includes("inc()"), "Should not display function inc");
      assert.ok(!output.includes("incBy"), "Should not display function incBy");
    });
  });

  describe("Multiple contracts", () => {
    it("Should display errors from Counter contract", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);

      await errorsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(output.includes("Counter"), "Should display Counter contract");
      assert.ok(
        output.includes("MaxValueReached"),
        "Should display MaxValueReached error",
      );
    });
  });
});

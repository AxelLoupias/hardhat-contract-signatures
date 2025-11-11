import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

describe("signature events tests", () => {
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
    it("Should define signature:events task", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      assert.notEqual(
        eventsTask,
        undefined,
        "signature:events task should be defined",
      );
    });

    it("Should have correct description", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      assert.equal(
        eventsTask.description,
        "Displays the signatures of the smart contract events",
      );
    });
  });

  describe("Task execution", () => {
    it("Should compile and display event signatures", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);

      await eventsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(output.includes("Counter"), "Should display Counter contract");
      assert.ok(output.includes("Increment"), "Should display Increment event");
    });

    it("Should display event topic hashes", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);

      await eventsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(
        output.includes(
          "0x51af157c2eee40f68107a47a49c32fbbeb0a3c9e5cd37aa56e88e6be92368a81",
        ),
        "Should display topic hash for Increment event",
      );
    });

    it("Should display contract names and event names", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);

      await eventsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(
        output.includes("contract"),
        "Should have contract column header",
      );
      assert.ok(
        output.includes("eventName"),
        "Should have eventName column header",
      );
      assert.ok(
        output.includes("topicHash"),
        "Should have topicHash column header",
      );
    });

    it("Should only display events (not errors or functions)", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);

      await eventsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(
        !output.includes("MaxValueReached"),
        "Should not display error MaxValueReached",
      );

      assert.ok(!output.includes("inc()"), "Should not display function inc");
      assert.ok(!output.includes("incBy"), "Should not display function incBy");
    });
  });

  describe("Multiple contracts", () => {
    it("Should display events from Counter contract", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);

      await eventsTask.run();

      const output = consoleOutput.join("\n");

      assert.ok(output.includes("Counter"), "Should display Counter contract");
      assert.ok(output.includes("Increment"), "Should display Increment event");
    });
  });
});

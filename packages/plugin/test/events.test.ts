import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

interface EventSignatureJson {
  contract: string;
  eventName: string;
  topicHash: string;
  full?: string;
  sign?: string;
}

describe("signature events tests", () => {
  let hre: HardhatRuntimeEnvironment;
  let consoleOutput: string[] = [];
  let originalConsoleLog: typeof console.log;

  const getJsonOutput = (): EventSignatureJson[] => {
    const output = consoleOutput.join("\n");
    const jsonStartIndex = output.indexOf("[");
    if (jsonStartIndex === -1) return [];
    const jsonString = output.substring(jsonStartIndex);
    return JSON.parse(jsonString) as EventSignatureJson[];
  };

  beforeEach(async () => {
    hre = await createFixtureProjectHRE("base-project");
    consoleOutput = [];

    originalConsoleLog = console.log;
    console.log = (...args: unknown[]) => {
      consoleOutput.push(args.map(String).join(" "));
    };
  });

  afterEach(() => {
    console.log = originalConsoleLog;
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

  describe("Selector (topic hash) with --json", () => {
    it("Should generate correct 32-byte topic hash", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const transferEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.eventName === "Transfer",
      );

      assert.ok(transferEvent, "Should find Transfer event");
      assert.ok(
        transferEvent.topicHash.startsWith("0x"),
        "Topic hash should start with 0x",
      );
      assert.equal(
        transferEvent.topicHash.length,
        66,
        "Topic hash should be 66 chars",
      );
    });
  });

  describe("Full signature with --json", () => {
    it("Should include 'event' keyword and parameter names", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const transferEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.eventName === "Transfer",
      );

      assert.ok(
        transferEvent?.full?.startsWith("event"),
        "Should start with 'event'",
      );
      assert.ok(
        transferEvent?.full?.includes("address indexed from") ||
          transferEvent?.full?.includes("indexed address from"),
        "Should include 'indexed' with param name 'from'",
      );
      assert.ok(
        transferEvent?.full?.includes("address indexed to") ||
          transferEvent?.full?.includes("indexed address to"),
        "Should include 'indexed' with param name 'to'",
      );
    });

    it("Should include 'indexed' keyword for indexed parameters", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const transferEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.eventName === "Transfer",
      );

      assert.ok(
        transferEvent?.full?.includes("indexed") &&
          transferEvent?.full?.includes("from"),
        "Should have indexed for 'from'",
      );
      assert.ok(
        transferEvent?.full?.includes("indexed") &&
          transferEvent?.full?.includes("to"),
        "Should have indexed for 'to'",
      );
      // Count how many times 'indexed' appears
      const indexedCount = (transferEvent?.full?.match(/indexed/g) || [])
        .length;
      assert.equal(indexedCount, 2, "Should have exactly 2 indexed parameters");
    });

    it("Should expand structs with field names in events", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const userRegisteredEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.eventName === "UserRegistered",
      );

      assert.ok(
        userRegisteredEvent?.full?.includes("address wallet"),
        "Should expand struct",
      );
      assert.ok(
        userRegisteredEvent?.full?.includes("uint256 balance"),
        "Should include fields",
      );
    });
  });

  describe("Minimal signature with --json", () => {
    it("Should include 'event' keyword but NOT parameter names", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const transferEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.eventName === "Transfer",
      );

      assert.ok(
        transferEvent?.sign?.startsWith("event"),
        "Should start with 'event'",
      );
      assert.ok(
        !transferEvent?.sign?.includes("from"),
        "Should NOT include param names",
      );
      assert.ok(
        !transferEvent?.sign?.includes("to"),
        "Should NOT include param names",
      );
    });

    it("Should NOT include 'indexed' keyword", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const transferEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.eventName === "Transfer",
      );

      assert.ok(
        !transferEvent?.sign?.includes("indexed"),
        "Should NOT include 'indexed'",
      );
      assert.ok(
        transferEvent?.sign?.includes("address") &&
          transferEvent?.sign?.includes("uint256"),
        "Should have parameter types",
      );
      assert.ok(
        !transferEvent?.sign?.includes("from") &&
          !transferEvent?.sign?.includes("to"),
        "Should NOT include parameter names",
      );
    });

    it("Should expand structs WITHOUT field names", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const userRegisteredEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.eventName === "UserRegistered",
      );

      assert.ok(
        userRegisteredEvent?.sign?.includes("(address,uint256,string)"),
        "Should expand without names",
      );
      assert.ok(
        !userRegisteredEvent?.sign?.includes("wallet"),
        "Should NOT include field names",
      );
    });
  });

  describe("Complex types with --json", () => {
    it("Should handle arrays in events", async () => {
      const eventsTask = hre.tasks.getTask(["signature", "events"]);
      await eventsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const arrayEvent = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.eventName === "BatchTransfer",
      );

      assert.ok(
        arrayEvent?.full?.includes("address[] to"),
        "Full should have array with name",
      );
      assert.ok(
        arrayEvent?.sign?.includes("address[]"),
        "Minimal should have array type",
      );
    });
  });
});

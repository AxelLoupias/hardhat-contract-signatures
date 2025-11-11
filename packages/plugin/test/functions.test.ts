import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

interface FunctionSignatureJson {
  contract: string;
  functionName: string;
  selector: string;
  full?: string;
  sign?: string;
}

describe("signature functions tests", () => {
  let hre: HardhatRuntimeEnvironment;
  let consoleOutput: string[] = [];
  let originalConsoleLog: typeof console.log;

  // Helper to extract JSON from console output (filters compilation messages)
  const getJsonOutput = (): FunctionSignatureJson[] => {
    const output = consoleOutput.join("\n");
    const jsonStartIndex = output.indexOf("[");
    if (jsonStartIndex === -1) return [];
    const jsonString = output.substring(jsonStartIndex);
    return JSON.parse(jsonString) as FunctionSignatureJson[];
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

  describe("Selector format", () => {
    it("Should generate correct 4-byte selector with --json", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const addFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.functionName === "add",
      );

      assert.ok(addFunction, "Should find add function");
      assert.ok(
        addFunction.selector.startsWith("0x"),
        "Selector should start with 0x",
      );
      assert.equal(
        addFunction.selector.length,
        10,
        "Selector should be 10 characters",
      );
      assert.equal(
        addFunction.selector,
        "0x771602f7",
        "Should match expected selector",
      );
    });
  });

  describe("Full signature with --json", () => {
    it("Should include 'function' keyword and parameter names", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const addFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.functionName === "add",
      );

      assert.ok(
        addFunction?.full?.startsWith("function "),
        "Should start with 'function'",
      );
      assert.ok(
        addFunction?.full?.includes("uint256 a"),
        "Should include param name 'a'",
      );
      assert.ok(
        addFunction?.full?.includes("uint256 b"),
        "Should include param name 'b'",
      );
    });

    it("Should include return parameter names", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const divModFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.functionName === "divMod",
      );

      assert.ok(
        divModFunction?.full?.includes("uint256 quotient"),
        "Should include return name",
      );
      assert.ok(
        divModFunction?.full?.includes("uint256 remainder"),
        "Should include return name",
      );
    });

    it("Should expand structs with field names", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const registerUserFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.functionName === "registerUser",
      );

      assert.ok(
        registerUserFunction?.full?.includes("(address wallet"),
        "Should expand struct",
      );
      assert.ok(
        registerUserFunction?.full?.includes("uint256 balance"),
        "Should include fields",
      );
      assert.ok(
        registerUserFunction?.full?.includes("string name)"),
        "Should include fields",
      );
    });
  });

  describe("Minimal signature with --json", () => {
    it("Should include 'function' keyword but NOT parameter names", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const addFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.functionName === "add",
      );

      assert.ok(
        addFunction?.sign?.startsWith("function "),
        "Should start with 'function'",
      );
      // Check that minimal signature doesn't have parameter names (no ", a," or ", b,")
      assert.ok(
        !addFunction?.sign?.includes("uint256 a"),
        "Should NOT include param name 'a' with commas",
      );
      assert.ok(
        !addFunction?.sign?.includes("uint256 b"),
        "Should NOT include param name 'b' before closing paren",
      );
      assert.ok(
        addFunction?.sign?.includes("(uint256,uint256)"),
        "Should have types only",
      );
    });

    it("Should expand structs WITHOUT field names", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const registerUserFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.functionName === "registerUser",
      );

      assert.ok(
        registerUserFunction?.sign?.includes("(address,uint256,string)"),
        "Should expand without names",
      );
      assert.ok(
        !registerUserFunction?.sign?.includes("wallet"),
        "Should NOT include field names",
      );
    });
  });

  describe("State modifiers with --json", () => {
    it("Should include 'pure' modifier", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const addFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.functionName === "add",
      );

      assert.ok(addFunction?.full?.includes("pure"), "Full should have 'pure'");
      assert.ok(
        addFunction?.sign?.includes("pure"),
        "Minimal should have 'pure'",
      );
    });

    it("Should include 'view' modifier", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const getBalanceFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.functionName === "getBalance",
      );

      assert.ok(
        getBalanceFunction?.full?.includes("view"),
        "Full should have 'view'",
      );
      assert.ok(
        getBalanceFunction?.sign?.includes("view"),
        "Minimal should have 'view'",
      );
    });

    it("Should include 'payable' modifier", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const depositFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.functionName === "deposit",
      );

      assert.ok(
        depositFunction?.full?.includes("payable"),
        "Full should have 'payable'",
      );
      assert.ok(
        depositFunction?.sign?.includes("payable"),
        "Minimal should have 'payable'",
      );
    });
  });

  describe("Complex types with --json", () => {
    it("Should handle arrays correctly", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const batchTransferFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.functionName === "batchTransfer",
      );

      assert.ok(
        batchTransferFunction?.full?.includes("address[] to"),
        "Full should have array with name",
      );
      assert.ok(
        batchTransferFunction?.sign?.includes("address[]"),
        "Minimal should have array type",
      );
    });

    it("Should handle array of structs", async () => {
      const functionsTask = hre.tasks.getTask(["signature", "functions"]);
      await functionsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const filterUsersFunction = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.functionName === "filterUsers",
      );

      assert.ok(
        filterUsersFunction?.full?.includes(
          "(address wallet, uint256 balance, string name)[]",
        ),
        "Full should expand array of structs with names",
      );
      assert.ok(
        filterUsersFunction?.sign?.includes("(address,uint256,string)[]"),
        "Minimal should expand array of structs without names",
      );
    });
  });
});

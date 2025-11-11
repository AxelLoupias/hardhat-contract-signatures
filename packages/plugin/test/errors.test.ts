import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { createFixtureProjectHRE } from "./helpers/fixture-projects.js";

interface ErrorSignatureJson {
  contract: string;
  errorName: string;
  selector: string;
  full?: string;
  sign?: string;
}

describe("signature errors tests", () => {
  let hre: HardhatRuntimeEnvironment;
  let consoleOutput: string[] = [];
  let originalConsoleLog: typeof console.log;

  const getJsonOutput = (): ErrorSignatureJson[] => {
    const output = consoleOutput.join("\n");
    const jsonStartIndex = output.indexOf("[");
    if (jsonStartIndex === -1) return [];
    const jsonString = output.substring(jsonStartIndex);
    return JSON.parse(jsonString) as ErrorSignatureJson[];
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

  describe("Selector format with --json", () => {
    it("Should generate correct 4-byte selector", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      await errorsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const invalidAmountError = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.errorName === "InvalidAmount",
      );

      assert.ok(invalidAmountError, "Should find InvalidAmount error");
      assert.ok(
        invalidAmountError.selector.startsWith("0x"),
        "Selector should start with 0x",
      );
      assert.equal(
        invalidAmountError.selector.length,
        10,
        "Selector should be 10 chars",
      );
    });
  });

  describe("Full signature with --json", () => {
    it("Should include 'error' keyword and parameter names", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      await errorsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const insufficientBalanceError = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.errorName === "InsufficientBalance",
      );

      assert.ok(
        insufficientBalanceError?.full?.startsWith("error "),
        "Should start with 'error'",
      );
      assert.ok(
        insufficientBalanceError?.full?.includes("uint256 available"),
        "Should include param name 'available'",
      );
      assert.ok(
        insufficientBalanceError?.full?.includes("uint256 required"),
        "Should include param name 'required'",
      );
    });

    it("Should expand structs with field names", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      await errorsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const invalidUserError = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.errorName === "InvalidUser",
      );

      assert.ok(
        invalidUserError?.full?.includes("address wallet"),
        "Should expand struct",
      );
      assert.ok(
        invalidUserError?.full?.includes("uint256 balance"),
        "Should include fields",
      );
      assert.ok(
        invalidUserError?.full?.includes("string name"),
        "Should include fields",
      );
    });
  });

  describe("Minimal signature with --json", () => {
    it("Should include 'error' keyword but NOT parameter names", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      await errorsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const insufficientBalanceError = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.errorName === "InsufficientBalance",
      );

      assert.ok(
        insufficientBalanceError?.sign?.startsWith("error"),
        "Should start with 'error'",
      );
      assert.ok(
        !insufficientBalanceError?.sign?.includes("requested"),
        "Should NOT include names",
      );
      assert.ok(
        !insufficientBalanceError?.sign?.includes("available"),
        "Should NOT include names",
      );
      assert.ok(
        insufficientBalanceError?.sign?.includes("(uint256,uint256)"),
        "Should have types only",
      );
    });

    it("Should expand structs WITHOUT field names", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      await errorsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const invalidUserError = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" && item.errorName === "InvalidUser",
      );

      assert.ok(
        invalidUserError?.sign?.includes("(address,uint256,string)"),
        "Should expand without names",
      );
      assert.ok(
        !invalidUserError?.sign?.includes("wallet"),
        "Should NOT include field names",
      );
    });
  });

  describe("Complex types with --json", () => {
    it("Should handle arrays in errors", async () => {
      const errorsTask = hre.tasks.getTask(["signature", "errors"]);
      await errorsTask.run({ json: true });

      const jsonOutput = getJsonOutput();
      const invalidArrayError = jsonOutput.find(
        (item) =>
          item.contract === "TestContract" &&
          item.errorName === "InvalidAddresses",
      );

      assert.ok(
        invalidArrayError?.full?.includes("address[] addresses"),
        "Full should have array with name",
      );
      assert.ok(
        invalidArrayError?.sign?.includes("address[]"),
        "Minimal should have array type",
      );
    });
  });
});

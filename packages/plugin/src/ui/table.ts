import Table, { CellOptions } from "cli-table3";
import { HardhatPluginError } from "hardhat/plugins";
import { FormatColumns } from "../types.js";
import { PLUGIN_NAME } from "../core/contracts.js";

const DEFAULT_WIDTH_COLS = 30;

const COLUMNS_NAMES: Record<FormatColumns, string> = {
  selector: "selector",
  "sign:minimal": "sign",
  "sign:sighash": "sighash",
  "sign:full": "full",
  "sign:json": "json",
  topicHash: "topicHash",
  type: "type",
};

export function getNamesFormatColumns(columnsType: FormatColumns[]) {
  return columnsType.map((item) => {
    return COLUMNS_NAMES[item];
  });
}

export function drawTable(
  headColumns: string[],
  contractData: CellOptions[][],
) {
  const maxWidth = process.stdout.columns ?? 400;

  const columnWidths = calculateColumnWidths(maxWidth, headColumns.length);

  if (columnWidths.some((width) => width <= 0)) {
    throw new HardhatPluginError(
      PLUGIN_NAME,
      `The terminal is too small to display all columns. Please resize the terminal.`,
    );
  }

  const table = new Table({
    head: ["contract", ...headColumns],
    style: { head: ["green"] },
    wordWrap: true,
    wrapOnWordBoundary: false,
    colWidths: [DEFAULT_WIDTH_COLS, ...columnWidths],
  });

  table.push();
  contractData.forEach((item) => table.push(item));

  console.log(table.toString());
}

export function calculateColumnWidths(
  maxWidth: number,
  headColumnCount: number,
): number[] {
  const fixedColumnWidth = DEFAULT_WIDTH_COLS;
  const totalSeparators = headColumnCount + 2; // +2 external borders
  const separatorWidth = totalSeparators * 3; // each separator uses 3 characters: " | "
  const widthUsed = fixedColumnWidth + separatorWidth;
  const remainingWidth = Math.max(0, maxWidth - widthUsed);

  // If there's not enough space or no columns, return minimum widths
  if (remainingWidth <= 0 || headColumnCount <= 0) {
    return new Array(Math.max(0, headColumnCount)).fill(12) as number[];
  }

  const baseColumnWidth = Math.max(
    18, // minimum width
    Math.floor(remainingWidth / headColumnCount),
  );

  const colWidths = new Array(headColumnCount).fill(baseColumnWidth);

  // Adjust for any remaining space due to integer division
  if (colWidths.length > 0) {
    const extraSpace = remainingWidth % headColumnCount;
    colWidths[0] += extraSpace;
  }

  return colWidths as number[];
}

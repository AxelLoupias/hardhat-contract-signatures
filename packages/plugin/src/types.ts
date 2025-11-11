// Base types
export type FragmentType = "function" | "event" | "error";

export type FormatColumns =
  | "selector"
  | "sign:minimal"
  | "sign:sighash"
  | "sign:full"
  | "sign:json"
  | "topicHash"
  | "type";

export type FunctionFormatColumns = Exclude<FormatColumns, "topicHash">;
export type ErrorFormatColumns = Exclude<FormatColumns, "topicHash">;
export type EventsFormatColumns = FormatColumns;

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? U[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

// Domain interfaces
export interface ContractArtifactData {
  name: string;
  path: string;
  qualifiedName: string;
}

export interface ContractSignature {
  exclude: string[];
  functionsColumns: FunctionFormatColumns[];
  eventsColumns: EventsFormatColumns[];
  errorsColumns: ErrorFormatColumns[];
  findColumns: FormatColumns[];
}

export interface ContractsConfig {
  contracts: ContractArtifactData[];
  functionsColumns: FunctionFormatColumns[];
  eventsColumns: EventsFormatColumns[];
  errorsColumns: ErrorFormatColumns[];
  findColumns: FormatColumns[];
}

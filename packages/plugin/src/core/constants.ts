export const STATE_MODIFIERS = ["view", "pure", "payable"] as const;

export type StateMutability = (typeof STATE_MODIFIERS)[number];

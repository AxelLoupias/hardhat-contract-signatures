import { AbiEvent, toEventSelector, toEventSignature } from "viem";
import {
  buildFullEventSignature,
  buildMinimalEventSignature,
} from "../formatters/event-formatter.js";

export const EventProcessor = {
  getSelector: (event: AbiEvent): string =>
    toEventSelector(event).substring(0, 10),
  getSignature: (event: AbiEvent): string => toEventSignature(event),
  getFullSignature: (event: AbiEvent): string => buildFullEventSignature(event),
  getMinimalSignature: (event: AbiEvent): string =>
    buildMinimalEventSignature(event),
};

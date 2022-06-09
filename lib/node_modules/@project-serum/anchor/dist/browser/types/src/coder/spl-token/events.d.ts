import { EventCoder } from "../index.js";
import { Idl } from "../../idl.js";
import { Event } from "../../program/event";
import { IdlEvent } from "../../idl";
export declare class SplTokenEventsCoder implements EventCoder {
    constructor(_idl: Idl);
    decode<E extends IdlEvent = IdlEvent, T = Record<string, string>>(_log: string): Event<E, T> | null;
}
//# sourceMappingURL=events.d.ts.map
import { Idl, IdlEvent } from "../../idl.js";
import { Event } from "../../program/event.js";
import { EventCoder } from "../index.js";
export declare class DexEventsCoder implements EventCoder {
    constructor(_idl: Idl);
    decode<E extends IdlEvent = IdlEvent, T = Record<string, string>>(log: string): Event<E, T> | null;
}
//# sourceMappingURL=events.d.ts.map
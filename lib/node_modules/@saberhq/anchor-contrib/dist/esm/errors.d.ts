import type { Idl } from "@project-serum/anchor";
import type { IdlErrorCode } from "@project-serum/anchor/dist/esm/idl.js";
import type { AnchorError } from "./index.js";
export declare type ErrorMap<T extends Idl> = {
    [K in AnchorError<T>["name"]]: AnchorError<T> & {
        name: K;
    };
};
/**
 * Generates the error mapping
 * @param idl
 * @returns
 */
export declare const generateErrorMap: <T extends Idl>(idl: T) => ErrorMap<T>;
/**
 * Returns a RegExp which matches the message of a program error.
 * @param err
 * @returns
 */
export declare const matchError: (err: IdlErrorCode) => RegExp;
/**
 * Returns a RegExp which matches the code of a custom program error.
 * @param err
 * @returns
 */
export declare const matchErrorCode: (code: number) => RegExp;
//# sourceMappingURL=errors.d.ts.map
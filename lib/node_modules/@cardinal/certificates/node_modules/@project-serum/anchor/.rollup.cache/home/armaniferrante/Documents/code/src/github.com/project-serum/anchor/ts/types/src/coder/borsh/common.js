import { Buffer } from "buffer";
import { snakeCase } from "snake-case";
import { sha256 } from "js-sha256";
// Not technically sighash, since we don't include the arguments, as Rust
// doesn't allow function overloading.
export function sighash(nameSpace, ixName) {
    let name = snakeCase(ixName);
    let preimage = `${nameSpace}:${name}`;
    return Buffer.from(sha256.digest(preimage)).slice(0, 8);
}
//# sourceMappingURL=common.js.map
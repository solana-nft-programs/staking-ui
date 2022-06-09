"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spl = void 0;
const token_js_1 = require("./token.js");
class Spl {
    static token(provider) {
        return (0, token_js_1.program)(provider);
    }
}
exports.Spl = Spl;
//# sourceMappingURL=index.js.map
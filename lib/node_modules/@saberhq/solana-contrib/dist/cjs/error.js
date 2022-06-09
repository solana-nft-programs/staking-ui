"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstAggregateError = void 0;
const firstAggregateError = (err) => {
    const errors = err.errors;
    const [firstError, ...remErrors] = [errors.pop(), ...errors];
    if (remErrors.length > 0) {
        console.error(remErrors);
    }
    return firstError;
};
exports.firstAggregateError = firstAggregateError;
//# sourceMappingURL=error.js.map
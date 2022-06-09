export const firstAggregateError = (err) => {
    const errors = err.errors;
    const [firstError, ...remErrors] = [errors.pop(), ...errors];
    if (remErrors.length > 0) {
        console.error(remErrors);
    }
    return firstError;
};
//# sourceMappingURL=error.js.map
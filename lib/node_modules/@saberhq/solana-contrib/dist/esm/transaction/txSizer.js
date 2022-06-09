function shortvecEncodeLength(bytes, len) {
    let rem_len = len;
    for (;;) {
        let elem = rem_len & 0x7f;
        rem_len >>= 7;
        if (rem_len === 0) {
            bytes.push(elem);
            break;
        }
        else {
            elem |= 0x80;
            bytes.push(elem);
        }
    }
}
/**
 * Calculates transaction size. If the transaction is too large, it does not throw.
 * @param tx
 * @returns
 */
export const calculateTxSizeUnsafe = (tx) => {
    // check if fee payer signed.
    const { feePayer } = tx;
    const hasFeePayerSigned = feePayer && tx.signatures.find((s) => s.publicKey.equals(feePayer));
    const signData = tx.serializeMessage();
    const numSigners = tx.signatures.length + (hasFeePayerSigned ? 1 : 0);
    const signatureCount = [];
    shortvecEncodeLength(signatureCount, numSigners);
    return signatureCount.length + numSigners * 64 + signData.length;
};
//# sourceMappingURL=txSizer.js.map
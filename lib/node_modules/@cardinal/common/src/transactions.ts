import * as splToken from "@solana/spl-token";
import type * as web3 from "@solana/web3.js";

/**
 * Utility function for adding a find or init associated token account instruction to a transaction
 * Useful when using associated token accounts so you can be sure they are created before hand
 * @param transaction
 * @param connection
 * @param mint
 * @param owner
 * @param payer
 * @param allowOwnerOffCurve
 * @returns The associated token account ID that was found or will be created. This also adds the relevent instruction to create it to the transaction if not found
 */
export async function withFindOrInitAssociatedTokenAccount(
  transaction: web3.Transaction,
  connection: web3.Connection,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  payer: web3.PublicKey,
  allowOwnerOffCurve?: boolean
): Promise<web3.PublicKey> {
  const associatedAddress = await splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    splToken.TOKEN_PROGRAM_ID,
    mint,
    owner,
    allowOwnerOffCurve
  );
  const account = await connection.getAccountInfo(associatedAddress);
  if (!account) {
    transaction.add(
      splToken.Token.createAssociatedTokenAccountInstruction(
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        splToken.TOKEN_PROGRAM_ID,
        mint,
        associatedAddress,
        owner,
        payer
      )
    );
  }
  return associatedAddress;
}

/**
 * Fecthes multiple accounts in batches since there is a limit of
 * 100 accounts per connection.getMultipleAccountsInfo call
 * @param connection
 * @param ids
 * @param config
 * @param batchSize
 * @returns
 */
export const getBatchedMultipleAccounts = async (
  connection: web3.Connection,
  ids: web3.PublicKey[],
  config?: web3.GetMultipleAccountsConfig,
  batchSize = 100
): Promise<(web3.AccountInfo<Buffer | web3.ParsedAccountData> | null)[]> => {
  const batches: web3.PublicKey[][] = [[]];
  ids.forEach((id) => {
    const batch = batches[batches.length - 1];
    if (batch) {
      if (batch.length >= batchSize) {
        batches.push([id]);
      } else {
        batch.push(id);
      }
    }
  });
  const batchAccounts = await Promise.all(
    batches.map((b) =>
      connection.getMultipleAccountsInfo(b, config as web3.Commitment)
    )
  );
  return batchAccounts.flat();
};

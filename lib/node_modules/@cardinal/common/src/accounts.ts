import * as splToken from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

import type { AccountFn } from "./";

/**
 * Tries to get account based on function fn
 * Return null if account doesn't exist
 * @param fn
 * @returns
 */
export async function tryGetAccount<T>(fn: AccountFn<T>) {
  try {
    return await fn();
  } catch {
    return null;
  }
}

/**
 * Utility function to get associated token address
 * @param mint
 * @param owner
 * @param allowOwnerOffCurve
 * @returns
 */
export async function findAta(
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  allowOwnerOffCurve?: boolean
): Promise<web3.PublicKey> {
  return splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    splToken.TOKEN_PROGRAM_ID,
    mint,
    owner,
    allowOwnerOffCurve
  );
}

/**
 * Gets owner of mintId
 * @param connection
 * @param mintId
 * @returns
 */
export const getOwner = async (
  connection: web3.Connection,
  mintId: string
): Promise<web3.PublicKey | undefined> => {
  const mint = new web3.PublicKey(mintId);
  const largestHolders = await connection.getTokenLargestAccounts(mint);
  const certificateMintToken = new splToken.Token(
    connection,
    mint,
    splToken.TOKEN_PROGRAM_ID,
    // not used
    web3.Keypair.generate()
  );

  const largestTokenAccount =
    largestHolders?.value[0]?.address &&
    (await certificateMintToken.getAccountInfo(
      largestHolders?.value[0]?.address
    ));
  return largestTokenAccount?.owner;
};

import {
  tryGetAccount,
  withFindOrInitAssociatedTokenAccount,
} from "@cardinal/common";
import { tokenManager } from "@cardinal/token-manager/dist/cjs/programs";
import { withRemainingAccountsForReturn } from "@cardinal/token-manager/dist/cjs/programs/tokenManager";
import { tokenManagerAddressFromMint } from "@cardinal/token-manager/dist/cjs/programs/tokenManager/pda";
import type { Wallet } from "@saberhq/solana-contrib";
import type { Connection, PublicKey, Transaction } from "@solana/web3.js";

export const withInvalidate = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  mintId: PublicKey
): Promise<Transaction> => {
  const tokenManagerId = await tokenManagerAddressFromMint(connection, mintId);

  const tokenManagerData = await tryGetAccount(() =>
    tokenManager.accounts.getTokenManager(connection, tokenManagerId)
  );

  if (!tokenManagerData) return transaction;

  const tokenManagerTokenAccountId = await withFindOrInitAssociatedTokenAccount(
    transaction,
    connection,
    mintId,
    tokenManagerId,
    wallet.publicKey,
    true
  );

  const remainingAccountsForReturn = await withRemainingAccountsForReturn(
    transaction,
    connection,
    wallet,
    tokenManagerData
  );

  transaction.add(
    await tokenManager.instruction.invalidate(
      connection,
      wallet,
      mintId,
      tokenManagerId,
      tokenManagerData.parsed.kind,
      tokenManagerData.parsed.state,
      tokenManagerTokenAccountId,
      tokenManagerData?.parsed.recipientTokenAccount,
      remainingAccountsForReturn
    )
  );
  return transaction;
};

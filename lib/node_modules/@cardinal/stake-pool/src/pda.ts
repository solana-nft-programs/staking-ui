import * as web3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { STAKE_ENTRY_SEED, STAKE_POOL_PROGRAM_ID } from ".";

export async function stakeEntryIdForMintId(mintId: web3.PublicKey) {
  const [stakeEntryId] = await web3.PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode(STAKE_ENTRY_SEED), mintId.toBytes()],
    STAKE_POOL_PROGRAM_ID
  );
  return stakeEntryId;
}

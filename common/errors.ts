import {
  REWARDS_CENTER_ADDRESS,
  REWARDS_CENTER_IDL,
} from '@cardinal/rewards-center'
import {
  REWARD_DISTRIBUTOR_ADDRESS,
  REWARD_DISTRIBUTOR_IDL,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import {
  STAKE_POOL_ADDRESS,
  STAKE_POOL_IDL,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import type { Idl } from '@project-serum/anchor'
import type { PublicKey, SendTransactionError } from '@solana/web3.js'

type ErrorCode = {
  code: string
  message: string
}

export const NATIVE_ERRORS: ErrorCode[] = [
  {
    code: 'WalletSignTransactionError',
    message: 'User rejected the request.',
  },
  {
    code: 'failed to get recent blockhash',
    message:
      'Solana is experiencing degrading performance. You transaction failed to execute.',
  },
  {
    code: 'Blockhash not found',
    message:
      'Solana is experiencing degrading performance. Transaction may or may not have gone through.',
  },
  {
    code: 'Transaction was not confirmed in',
    message:
      'Transaction timed out waiting on confirmation from Solana. It may or may not have gone through.',
  },
  {
    code: 'Attempt to debit an account but found no record of a prior credit',
    message: 'Wallet has never had any sol before. Try adding sol first.',
  },
  {
    code: 'Provided owner is not allowed',
    message: 'Token account is already created for this user',
  },
  {
    code: 'not associated with',
    message: 'Account not associated with this mint',
  },
  {
    code: 'rent-exempt',
    message:
      'Insufficient funds. User does not have enough sol to complete the transaction',
  },
  // token program errors
  {
    code: 'insufficient funds',
    message:
      'Insufficient funds. User does not have enough balance of token to complete the transaction',
  },
  // token program errors
  {
    code: '0x1',
    message:
      'Insufficient funds. User does not have enough balance of token to complete the transaction',
  },
  {
    code: '0x4',
    message:
      'Invalid owner. The user is likely not mint authority of this token.',
  },
  {
    code: '91',
    message: 'Token is not ellgible for original receipts',
  },
  // anchor errors
  {
    code: '100',
    message: 'InstructionMissing: 8 byte instruction identifier not provided',
  },
  {
    code: '101',
    message:
      'InstructionFallbackNotFound: Fallback functions are not supported',
  },
  {
    code: '102',
    message:
      'InstructionDidNotDeserialize: The program could not deserialize the given instruction',
  },
  {
    code: '103',
    message:
      'InstructionDidNotSerialize: The program could not serialize the given instruction',
  },
  {
    code: '1000',
    message:
      'IdlInstructionStub: The program was compiled without idl instructions',
  },
  {
    code: '1001',
    message:
      'IdlInstructionInvalidProgram: Invalid program given to the IDL instruction',
  },
  { code: '2000', message: 'ConstraintMut: A mut constraint was violated' },
  {
    code: '2001',
    message: 'ConstraintHasOne: A has one constraint was violated',
  },
  {
    code: '2002',
    message: 'ConstraintSigner: A signer constraint as violated',
  },
  { code: '2003', message: 'ConstraintRaw: A raw constraint was violated' },
  {
    code: '2004',
    message: 'ConstraintOwner: An owner constraint was violated',
  },
  {
    code: '2005',
    message: 'ConstraintRentExempt: A rent exemption constraint was violated',
  },
  {
    code: '2006',
    message: 'ConstraintSeeds: A seeds constraint was violated',
  },
  {
    code: '2007',
    message: 'ConstraintExecutable: An executable constraint was violated',
  },
  {
    code: '2008',
    message: 'ConstraintState: A state constraint was violated',
  },
  {
    code: '2009',
    message: 'ConstraintAssociated: An associated constraint was violated',
  },
  {
    code: '2010',
    message:
      'ConstraintAssociatedInit: An associated init constraint was violated',
  },
  {
    code: '2011',
    message: 'ConstraintClose: A close constraint was violated',
  },
  {
    code: '2012',
    message: 'ConstraintAddress: An address constraint was violated',
  },
  {
    code: '2013',
    message: 'ConstraintZero: Expected zero account discriminant',
  },
  {
    code: '2014',
    message: 'ConstraintTokenMint: A token mint constraint was violated',
  },
  {
    code: '2015',
    message: 'ConstraintTokenOwner: A token owner constraint was violated',
  },
  {
    code: '2016',
    message:
      'ConstraintMintMintAuthority: A mint mint authority constraint was violated',
  },
  {
    code: '2017',
    message:
      'ConstraintMintFreezeAuthority: A mint freeze authority constraint was violated',
  },
  {
    code: '2018',
    message: 'ConstraintMintDecimals: A mint decimals constraint was violated',
  },
  {
    code: '2019',
    message: 'ConstraintSpace: A space constraint was violated',
  },
  {
    code: '3000',
    message:
      'AccountDiscriminatorAlreadySet: The account discriminator was already set on this account',
  },
  {
    code: '3001',
    message:
      'AccountDiscriminatorNotFound: No 8 byte discriminator was found on the account',
  },
  {
    code: '3002',
    message:
      'AccountDiscriminatorMismatch: 8 byte discriminator did not match what was expected',
  },
  {
    code: '3003',
    message: 'AccountDidNotDeserialize: Failed to deserialize the account',
  },
  {
    code: '3004',
    message: 'AccountDidNotSerialize: Failed to serialize the account',
  },
  {
    code: '3005',
    message:
      'AccountNotEnoughKeys: Not enough account keys given to the instruction',
  },
  {
    code: '3006',
    message: 'AccountNotMutable: The given account is not mutable',
  },
  {
    code: '3007',
    message:
      'AccountNotProgramOwned: The given account is not owned by the executing program',
  },
  {
    code: '3008',
    message: 'InvalidProgramId: Program ID was not as expected',
  },
  {
    code: '3009',
    message: 'InvalidProgramExecutable: Program account is not executable',
  },
  {
    code: '3010',
    message: 'AccountNotSigner: The given account did not sign',
  },
  {
    code: '3011',
    message:
      'AccountNotSystemOwned: The given account is not owned by the system program',
  },
  {
    code: '3012',
    message:
      'Account not found. This likely means you have no funds to pay for this action.',
  },
  {
    code: '3013',
    message:
      'AccountNotProgramData: The given account is not a program data account',
  },
  {
    code: '3014',
    message:
      'AccountNotAssociatedTokenAccount: The given account is not the associated token account',
  },
  {
    code: '4000',
    message:
      'StateInvalidAddress: The given state account does not have the correct address',
  },
  {
    code: '5000',
    message:
      'Deprecated: The API being used is deprecated and should no longer be used',
  },
].reverse()

export type ErrorOptions = {
  /** ProgramIdls in priority order */
  programIdls?: { idl: Idl; programId: PublicKey }[]
  /** Additional errors by code */
  additionalErrors?: ErrorCode[]
}

export const handleError = (
  e: any,
  fallBackMessage = 'Transaction failed',
  // programIdls in priority order
  options: ErrorOptions = {
    programIdls: [
      { programId: STAKE_POOL_ADDRESS, idl: STAKE_POOL_IDL },
      { programId: REWARD_DISTRIBUTOR_ADDRESS, idl: REWARD_DISTRIBUTOR_IDL },
      { programId: REWARDS_CENTER_ADDRESS, idl: REWARDS_CENTER_IDL },
    ],
    additionalErrors: NATIVE_ERRORS,
  }
): string => {
  const programIdls = options.programIdls ?? []
  const additionalErrors = options.additionalErrors ?? []
  const hex = (e as SendTransactionError).message?.split(' ').at(-1)
  const dec = parseInt(hex || '', 16)
  const logs =
    (e as SendTransactionError).logs ?? [
      (e as SendTransactionError).message ?? '',
    ] ?? [(e as Error).toString()] ??
    []

  const matchedErrors: { programMatch?: boolean; errorMatch?: string }[] = [
    ...[
      ...programIdls.map(({ idl, programId }) => ({
        // match program on any log that includes programId and 'failed'
        programMatch: logs?.some(
          (l) => l.includes(programId.toString()) && l.includes('failed')
        ),
        // match error with decimal
        errorMatch: idl.errors?.find((err) => err.code === dec)?.msg,
      })),
      {
        // match native error with decimal
        errorMatch: additionalErrors.find((err) => err.code === dec.toString())
          ?.message,
      },
    ],
    ...[
      ...programIdls.map(({ idl }) => ({
        errorMatch: idl.errors?.find(
          (err) =>
            // message includes error
            (e as SendTransactionError).message?.includes(
              err.code.toString()
            ) ||
            // toString includes error
            (e as Error).toString().includes(err.code.toString()) ||
            // any log includes error
            (e as SendTransactionError).logs?.some((l) =>
              l.toString().includes(err.code.toString())
            )
        )?.msg,
      })),
      {
        errorMatch: additionalErrors.find(
          (err) =>
            // message includes error
            (e as SendTransactionError).message?.includes(err.code) ||
            // toString includes error
            (e as Error).toString().includes(err.code) ||
            // any log includes error
            (e as SendTransactionError).logs?.some((l) =>
              l.toString().includes(err.code)
            )
        )?.message,
      },
    ],
  ]

  console.log('Matched errors:', matchedErrors)
  return (
    matchedErrors.find((e) => e.programMatch && e.errorMatch)?.errorMatch ||
    matchedErrors.find((e) => e.errorMatch)?.errorMatch ||
    fallBackMessage
  )
}

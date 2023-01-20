import { BN } from '@project-serum/anchor'
import { tryPublicKey } from 'common/utils'
import * as Yup from 'yup'

export const publicKeyValidationTest = (value: string | undefined): boolean => {
  return tryPublicKey(value) ? true : false
}

export const optionalBnValidationTest = (
  value: string | undefined
): boolean => {
  if (value === undefined) return true
  try {
    new BN(value)
    return true
  } catch (e) {
    const num = Number(value)
    if (0 < num && num < 1) return true
    return false
  }
}

export const bnValidationTest = (value: string | undefined): boolean => {
  if (value === undefined) return false
  return optionalBnValidationTest(value)
}

export const creationFormSchema = Yup.object({
  requireCollections: Yup.array()
    .of(
      Yup.string().test(
        'is-public-key',
        'Invalid collection address',
        publicKeyValidationTest
      )
    )
    .required(),
  requireCreators: Yup.array()
    .of(
      Yup.string().test(
        'is-public-key',
        'Invalid creator address',
        publicKeyValidationTest
      )
    )
    .required(),
  requiresAuthorization: Yup.boolean(),
  resetOnStake: Yup.boolean(),
  cooldownPeriodSeconds: Yup.number().optional().min(0),
  minStakeSeconds: Yup.number().optional().min(0),
  endDate: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid endDate', bnValidationTest),
  rewardMintAddress: Yup.string().test(
    'is-public-key',
    'Invalid reward mint address',
    publicKeyValidationTest
  ),
  rewardAmount: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reward amount', bnValidationTest),
  rewardDurationSeconds: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reward durations seconds', bnValidationTest),
  rewardMintSupply: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reward mint supply', bnValidationTest),
  maxRewardSecondsReceived: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reward durations seconds', bnValidationTest),
  multiplierDecimals: Yup.string().optional(),
  defaultMultiplier: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid default multiplier', bnValidationTest),
})

export type CreationForm = Yup.InferType<typeof creationFormSchema>

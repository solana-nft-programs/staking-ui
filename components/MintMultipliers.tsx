import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { useFormik } from 'formik'
import { useHandleSetMultipliers } from 'handlers/useHandleSetMultipliers'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import * as Yup from 'yup'

import { publicKeyValidationTest } from './stake-pool-creation/Schema'
import { TextInput } from './UI/inputs/TextInput'
import { TextInputIcon } from './UI/inputs/TextInputIcon'

const multiplierFormSchema = Yup.object({
  multipliers: Yup.array().of(Yup.string()),
  multiplierMints: Yup.array().of(
    Yup.string().test(
      'is-public-key',
      'Invalid multplier mint address',
      publicKeyValidationTest
    )
  ),
})
export type MultipliersForm = Yup.InferType<typeof multiplierFormSchema>

export const MintMultipliers = () => {
  const rewardDistributor = useRewardDistributorData()
  const handleSetMultipliers = useHandleSetMultipliers()

  const initialValues: MultipliersForm = {
    multipliers: [''],
    multiplierMints: [''],
  }
  const formState = useFormik({
    initialValues,
    onSubmit: () => {},
    validationSchema: multiplierFormSchema,
  })
  const { values, setFieldValue } = formState

  const { multipliers, multiplierMints } = values
  if (!rewardDistributor.data || !multipliers || !multiplierMints) return <></>
  return (
    <div>
      <FormFieldTitleInput
        title={'Set multiplier for given mints'}
        description={
          <div>
            <p className="text-sm italic text-gray-300">
              Set the stake multiplier for given mints.
              <br />
              For a 1x multiplier, enter value{' '}
              {10 ** (rewardDistributor.data.parsed?.multiplierDecimals || 0)},
              for a 2x multiplier enter value{' '}
              {2 *
                10 **
                  (rewardDistributor.data.parsed?.multiplierDecimals || 0)}{' '}
              ...
            </p>
            <p className="text-sm italic text-gray-300">
              For decimal multipliers, work with the reward distributor
              {"'"}s <b>multiplierDecimals</b>. If you set multiplierDecimals =
              1, then for 1.5x multiplier, enter value 15 so that
              value/10**multiplierDecimals = 15/10^1 = 1.5
            </p>
            <p className="mt-2 text-sm italic text-gray-300">
              <b>NOTE</b> that for 1.5x, you could set multiplierDecimals = 2
              and enter value 150, or multiplierDecimals = 3 and enter value
              1500 ...
            </p>
            <p className="mt-2 mb-5 text-sm italic text-gray-300">
              <b>WARNING</b> Do not set more than a few at at time. If needed
              take a look at the scripts in{' '}
              <a
                href="https://github.com/cardinal-labs/cardinal-staking/tree/main/tools"
                className="text-blue-500"
                target="_blank"
                rel="noreferrer"
              >
                tools
              </a>{' '}
              to set many at a time.
            </p>
          </div>
        }
      />
      <div className="flex flex-row gap-2">
        <TextInput
          className="w-1/6"
          placeholder="0"
          onChange={(e) => {
            setFieldValue('multipliers[0]', e.target.value)
          }}
        />
        <TextInputIcon
          icon="Add"
          placeholder={'CmAy...A3fD'}
          onChange={(e) => {
            setFieldValue('multiplierMints[0]', e.target.value)
          }}
          onIconClick={() => {
            setFieldValue(`multiplierMints`, ['', ...multiplierMints])
            setFieldValue(`multipliers`, ['', ...multipliers])
          }}
        />
      </div>
      {multiplierMints.map(
        (v, i) =>
          i > 0 && (
            <div key={i} className="mt-3 flex flex-row gap-2">
              <TextInput
                className="w-1/6"
                placeholder="0"
                onChange={(e) => {
                  setFieldValue(`multipliers[${i}]`, e.target.value)
                }}
              />
              <TextInputIcon
                icon="Remove"
                placeholder={'CmAy...A3fD'}
                onChange={(e) => {
                  setFieldValue(`multiplierMints[${i}]`, e.target.value)
                }}
                onIconClick={() => {
                  setFieldValue(
                    `multiplierMints`,
                    multiplierMints.filter((_, ix) => ix !== i)
                  )
                  setFieldValue(
                    `multipliers`,
                    multipliers.filter((_, ix) => ix !== i)
                  )
                }}
              />
            </div>
          )
      )}
      <AsyncButton
        loading={handleSetMultipliers.isLoading}
        onClick={() =>
          handleSetMultipliers.mutate({
            multiplierMints: multiplierMints,
            multipliers: multipliers,
          })
        }
        inlineLoader
        className="mt-3 flex items-center justify-center"
      >
        Set Multipliers
      </AsyncButton>
    </div>
  )
}

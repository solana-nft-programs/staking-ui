import { AsyncButton } from 'common/Button'
import { useFormik } from 'formik'
import { useHandleSetMultipliers } from 'handlers/useHandleSetMultipliers'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import * as Yup from 'yup'

import { publicKeyValidationTest } from './StakePoolForm'

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
      <label
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
        htmlFor="require-authorization"
      >
        Set multiplier for given mints
      </label>
      <p className="text-sm italic text-gray-300">
        Set the stake multiplier for given mints.
        <br />
        For a 1x multiplier, enter value{' '}
        {10 ** rewardDistributor.data.parsed.multiplierDecimals}, for a 2x
        multiplier enter value{' '}
        {2 * 10 ** rewardDistributor.data.parsed.multiplierDecimals} ...
      </p>
      <p className="text-sm italic text-gray-300">
        For decimal multipliers, work with the reward distributor
        {"'"}s <b>multiplierDecimals</b>. If you set multiplierDecimals = 1,
        then for 1.5x multiplier, enter value 15 so that
        value/10**multiplierDecimals = 15/10^1 = 1.5
      </p>
      <p className="mt-2 text-sm italic text-gray-300">
        <b>NOTE</b> that for 1.5x, you could set multiplierDecimals = 2 and
        enter value 150, or multiplierDecimals = 3 and enter value 1500 ...
      </p>
      <p className="mt-2 mb-5 text-sm italic text-gray-300">
        <b>WARNING</b> Do not set more than a few at at time. If needed take a
        look at the scripts in{' '}
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
      <span className="flex flex-row gap-5">
        <input
          className="mb-3 w-1/6 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
          type="text"
          placeholder={'0'}
          onChange={(e) => {
            setFieldValue('multipliers[0]', e.target.value)
          }}
        />
        <div
          className={`mb-3 flex w-full appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
        >
          <input
            className={`mr-5 w-full bg-transparent focus:outline-none`}
            type="text"
            autoComplete="off"
            onChange={(e) => {
              setFieldValue('multiplierMints[0]', e.target.value)
            }}
            placeholder={'CmAy...A3fD'}
            name="requireCollections"
          />
          <div
            className="cursor-pointer text-xs text-gray-400"
            onClick={() => {
              setFieldValue(`multiplierMints`, ['', ...multiplierMints])
              setFieldValue(`multipliers`, ['', ...multipliers])
            }}
          >
            Add
          </div>
        </div>
      </span>
      {multiplierMints.map(
        (v, i) =>
          i > 0 && (
            <span className="flex flex-row gap-5">
              <input
                className="mb-3 w-1/6 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                type="text"
                placeholder={'0'}
                onChange={(e) => {
                  setFieldValue(`multipliers[${i}]`, e.target.value)
                }}
              />
              <div
                className={`mb-3 flex w-full appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
              >
                <input
                  className={`mr-5 w-full bg-transparent focus:outline-none`}
                  type="text"
                  autoComplete="off"
                  onChange={(e) => {
                    setFieldValue(`multiplierMints[${i}]`, e.target.value)
                  }}
                  placeholder={'CmAy...A3fD'}
                  name="requireCollections"
                />
                <div
                  className="cursor-pointer text-xs text-gray-400"
                  onClick={() => {
                    setFieldValue(
                      `multiplierMints`,
                      multiplierMints.filter((_, ix) => ix !== i)
                    )
                    setFieldValue(
                      `multipliers`,
                      multipliers.filter((_, ix) => ix !== i)
                    )
                  }}
                >
                  Remove
                </div>
              </div>
            </span>
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
        className="w-max"
      >
        Set Multipliers
      </AsyncButton>
    </div>
  )
}

import type { PublicKey } from '@solana/web3.js'
import type { StakePoolMetadata } from 'api/mapping'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { useFormik } from 'formik'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import * as Yup from 'yup'

import { TextInput } from '@/components/UI/inputs/TextInput'

const defaultValues = (stakePoolData: StakePoolMetadata) => {
  return {
    name: stakePoolData.name,
  }
}

const validationSchema = Yup.object({
  name: Yup.string().required(),
})

export const AdvancedConfigForm = ({
  onSuccess,
}: {
  onSuccess?: (p: PublicKey | undefined) => void
}) => {
  const stakePooldId = useStakePoolId()
  const stakePool = useStakePoolData()
  const stakePoolMetadata = useStakePoolMetadata()
  const initialValues = defaultValues(
    stakePoolMetadata?.data ?? ({} as StakePoolMetadata)
  )

  const formState = useFormik({
    initialValues,
    onSubmit: () => {},
    validationSchema,
  })

  if (stakePooldId && !stakePool.isFetched) return <LoadingSpinner />
  const { values, errors, setFieldValue, setValues } = formState

  return (
    <div className="w-full">
      <FormFieldTitleInput
        title={'Name'}
        description={
          ' Name of this stake pool used as an id. Should be in lower-case kebab-case since it is used in the URL as /{name}'
        }
      />
      <TextInput
        disabled={false}
        hasError={!!values.name && values.name !== '' && !!errors.name}
        placeholder={'Enter name'}
        value={values.name}
        onChange={(e) => {
          setFieldValue('name', e.target.value)
        }}
      />
    </div>
  )
}

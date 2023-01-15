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
    ...stakePoolData,
  }
}

const validationSchema = Yup.object({
  name: Yup.string().required(),
  displayName: Yup.string().required(),
  nameInHeader: Yup.string(),
  stakePoolAddress: Yup.number().required(),
  description: Yup.string(),
  receiptType: Yup.number(),
  tokenStandard: Yup.number(),
  hidden: Yup.boolean(),
  notFound: Yup.boolean(),
  hostname: Yup.string(),
  hideFooter: Yup.boolean(),
  redirect: Yup.string(),
  hideAllowedTokens: Yup.boolean(),
  // styles is a stringified JSON object
  styles: Yup.string(),
  contrastHomepageBkg: Yup.boolean(),
  colors: Yup.object({
    primary: Yup.string().required(),
    secondary: Yup.string().required(),
    accent: Yup.string(),
    fontColor: Yup.string(),
    fontColorSecondary: Yup.string(),
    backgroundSecondary: Yup.string(),
    fontColorTertiary: Yup.string(),
  }),
  disallowRegions: Yup.array().of(Yup.string()),
  logoPadding: Yup.boolean(),
  socialLinks: Yup.array(),
  imageUrl: Yup.string(),
  secondaryImageUrl: Yup.string(),
  backgroundImage: Yup.string(),
  websiteUrl: Yup.string(),
  maxStaked: Yup.number(),
  links: Yup.array().of(
    Yup.object({
      text: Yup.string().required(),
      value: Yup.string().required(),
    })
  ),
  airdrops: Yup.array().of(
    Yup.object({
      name: Yup.string().required(),
      symbol: Yup.string().required(),
      uri: Yup.string().required(),
    })
  ),
  analytics: Yup.array().of(
    Yup.object({
      metadata: Yup.object({
        key: Yup.string().required(),
        type: Yup.string().required(),
        totals: Yup.array().of(
          Yup.object({
            key: Yup.string().required(),
            value: Yup.number().required(),
          })
        ),
      }),
    })
  ),
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

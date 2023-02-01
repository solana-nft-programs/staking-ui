import type { StakePoolMetadata } from 'api/mapping'
import { TokenStandard } from 'api/mapping'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { Selector } from 'common/Selector'
import { SelectorBoolean } from 'common/SelectorBoolean'
import { Tooltip } from 'common/Tooltip'
import { useFormik } from 'formik'
import { useHandlePoolConfig } from 'handlers/useHandlePoolConfig'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { HexColorPicker } from 'react-colorful'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import validateColor from 'validate-color'
import * as Yup from 'yup'

import { publicKeyValidationTest } from '@/components/stake-pool-creation/Schema'
import { NumberInput } from '@/components/UI/inputs/NumberInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'

const defaultValues = (stakePoolData: StakePoolMetadata) => {
  return {
    ...stakePoolData,
  }
}

const colorOptions = [
  {
    label: 'Primary',
    value: 'primary',
    description: 'Primary color',
  },
  {
    label: 'Secondary',
    value: 'secondary',
    description: 'Secondary color',
  },
  {
    label: 'Accent',
    value: 'accent',
    description: 'Accent color',
  },
  {
    label: 'Font',
    value: 'fontColor',
    description: 'Font color',
  },
  {
    label: 'Secondary font',
    value: 'fontColorSecondary',
    description: 'Secondary font color',
  },
  {
    label: 'Secondary background',
    value: 'backgroundSecondary',
    description: 'Secondary background color',
  },
] as const

export type TokenStandardOptions = 'non-fungible' | 'fungible' | 'none'

// const tokenStandardOptions = [
//   { label: 'Non-fungible', value: String(TokenStandard.NonFungible) },
//   { label: 'Fungible', value: String(TokenStandard.Fungible) },
//   { label: 'None', value: String(TokenStandard.None) },
// ]

const validationSchema = Yup.object({
  name: Yup.string().required(),
  displayName: Yup.string().required(),
  nameInHeader: Yup.string(),
  stakePoolAddress: Yup.string().test(
    'is-public-key',
    'Invalid reward mint address',
    publicKeyValidationTest
  ),
  description: Yup.string(),
  receiptType: Yup.string(),
  tokenStandard: Yup.number(),
  hidden: Yup.boolean(),
  notFound: Yup.boolean(),
  hostname: Yup.string(),
  hideFooter: Yup.boolean(),
  redirect: Yup.string(),
  hideAllowedTokens: Yup.boolean(),
  styles: Yup.string(),
  contrastHomepageBkg: Yup.boolean(),
  colors: Yup.object({
    primary: Yup.string()
      .required()
      .test('is-color', 'Invalid color', (value) => {
        return (
          (value !== undefined && validateColor(value)) ||
          validateColor(`#${value}`)
        )
      }),
    secondary: Yup.string()
      .required()
      .test('is-color', 'Invalid color', (value) => {
        return (
          (value !== undefined && validateColor(value)) ||
          validateColor(`#${value}`)
        )
      }),
    accent: Yup.string().test('is-color', 'Invalid color', (value) => {
      return (
        (value !== undefined && validateColor(value)) ||
        validateColor(`#${value}`)
      )
    }),
    fontColor: Yup.string().test('is-color', 'Invalid color', (value) => {
      return (
        (value !== undefined && validateColor(value)) ||
        validateColor(`#${value}`)
      )
    }),
    fontColorSecondary: Yup.string().test(
      'is-color',
      'Invalid color',
      (value) => {
        return (
          (value !== undefined && validateColor(value)) ||
          validateColor(`#${value}`)
        )
      }
    ),
    backgroundSecondary: Yup.string().test(
      'is-color',
      'Invalid color',
      (value) => {
        return (
          (value !== undefined && validateColor(value)) ||
          validateColor(`#${value}`)
        )
      }
    ),
    fontColorTertiary: Yup.string().test(
      'is-color',
      'Invalid color',
      (value) => {
        return (
          (value !== undefined && validateColor(value)) ||
          validateColor(`#${value}`)
        )
      }
    ),
  }),
  disallowRegions: Yup.array().of(
    Yup.object({
      code: Yup.string().required(),
      subdivisions: Yup.string(),
    })
  ),
  logoPadding: Yup.boolean(),
  socialLinks: Yup.array().of(Yup.string()),
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

export const AdvancedConfigForm = () => {
  const handlePoolConfig = useHandlePoolConfig()
  const stakePooldId = useStakePoolId()
  const stakePool = useStakePoolData()
  const stakePoolMetadata = useStakePoolMetadata()
  const initialValues = stakePoolMetadata?.data
    ? defaultValues({
        disallowRegions: stakePoolMetadata?.data?.disallowRegions || [],
        ...stakePoolMetadata.data,
      })
    : defaultValues({} as StakePoolMetadata)

  const formState = useFormik({
    initialValues,
    onSubmit: () => {},
    validationSchema,
  })

  if (stakePooldId && !stakePool.isFetched) return <LoadingSpinner />
  const { values, errors, setFieldValue } = formState

  return (
    <div className="w-full space-y-8">
      <div className="w-full">
        <div className="flex">
          <div>
            <FormFieldTitleInput
              title={'Name'}
              description={
                'Name of this stake pool used as an id. Should be in lower-case kebab-case since it is used in the URL as /{name}'
              }
            />
          </div>
        </div>
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
      <div>
        <FormFieldTitleInput
          title={'Display Name'}
          description={
            'Display name to be displayed in the header. Often the same as name but with capital letters and spaces'
          }
        />
        <TextInput
          disabled={false}
          hasError={
            !!values.displayName &&
            values.displayName !== '' &&
            !!errors.displayName
          }
          placeholder={'Enter display name'}
          value={values.displayName}
          onChange={(e) => {
            setFieldValue('displayName', e.target.value)
          }}
        />
      </div>
      <div>
        <FormFieldTitleInput
          title={'Name in Header'}
          description={'Whether or not to show name in header'}
        />
        <SelectorBoolean
          handleChange={(v) => setFieldValue('nameInHeader', v)}
        />
      </div>
      <div>
        <FormFieldTitleInput
          title={'Description'}
          description={'Description for this stake pool'}
        />
        <TextInput
          hasError={
            !!values.description &&
            values.description !== '' &&
            !!errors.description
          }
          placeholder={'Enter description'}
          value={values.description}
          onChange={(e) => {
            setFieldValue('description', e.target.value)
          }}
        />
      </div>
      <div>
        <FormFieldTitleInput
          title={'Token standard'}
          description={
            'Default empty. Setting this will tell the UI to only show tokens of that standard. Supports fungible or non-fungible'
          }
        />
        <Selector<TokenStandardOptions>
          className="rounded-l-none"
          onChange={(e) => setFieldValue('tokenStandard', e?.value)}
          defaultOption={{
            label: 'Non-fungible',
            value: String(TokenStandard.NonFungible) as TokenStandardOptions,
          }}
          options={[
            {
              label: 'Non-fungible',
              value: String(TokenStandard.NonFungible) as TokenStandardOptions,
            },
            {
              label: 'Fungible',
              value: String(TokenStandard.Fungible) as TokenStandardOptions,
            },
            {
              label: 'None',
              value: String(TokenStandard.None) as TokenStandardOptions,
            },
          ]}
        />
      </div>
      <div>
        <FormFieldTitleInput
          title={'Not found'}
          description={'Optional config to disable finding this pool'}
        />
        <SelectorBoolean handleChange={(v) => setFieldValue('notFound', v)} />
      </div>
      <div>
        <FormFieldTitleInput
          title={
            <div className="flex items-center">
              <div>Hostname</div>
              <Tooltip
                title={
                  <div>
                    Set the following record on your DNS provider:
                    <br />
                    <br />
                    Type NAME CNAME <br />
                    CNAME [your subdomain] cname.vercel-dns.com
                  </div>
                }
              >
                <div className="ml-2 flex cursor-pointer flex-row items-center justify-center gap-2">
                  <BsFillInfoCircleFill className="text-medium-3" />
                </div>
              </Tooltip>
            </div>
          }
          description={'Optional hostname to remap'}
        />
        <TextInput
          disabled={false}
          hasError={
            !!values.hostname && values.hostname !== '' && !!errors.hostname
          }
          placeholder={'Enter hostname'}
          value={values.hostname}
          onChange={(e) => {
            setFieldValue('hostname', e.target.value)
          }}
        />
      </div>
      <div>
        <FormFieldTitleInput
          title={'Hide footer'}
          description={'Optional config to disable finding this pool'}
        />
        <SelectorBoolean handleChange={(v) => setFieldValue('notFound', v)} />
      </div>
      <div>
        <FormFieldTitleInput
          title={'Redirect url'}
          description={
            'Optional config to link redirect to page when you click on this pool'
          }
        />
        <TextInput
          disabled={false}
          hasError={
            !!values.redirect && values.redirect !== '' && !!errors.redirect
          }
          placeholder={'Enter redirect url'}
          value={values.redirect}
          onChange={(e) => {
            setFieldValue('redirect', e.target.value)
          }}
        />
      </div>
      <div>
        <FormFieldTitleInput
          title={'Contrast homepage background'}
          description={'Whether or not to contrast the background'}
        />
        <SelectorBoolean
          handleChange={(v) => setFieldValue('contrastHomepageBkg', v)}
        />
      </div>
      <HeadingSecondary>Colors</HeadingSecondary>
      <div className="full mx-auto -mt-4 flex flex-wrap justify-around space-x-4">
        {colorOptions.map(({ label, value, description }) => (
          <div key={value} className="flex flex-col py-8">
            <FormFieldTitleInput title={label} description={description} />
            <div className="mb-3 self-center">
              <HexColorPicker
                color={values.colors?.[value] || undefined}
                onChange={(color) => setFieldValue(`colors.${value}`, color)}
              />
            </div>
            <div className="self-center">
              <TextInput
                disabled={false}
                hasError={
                  !!values.colors?.[value] &&
                  values.colors?.[value] !== '' &&
                  !!errors.colors?.[value as keyof typeof errors.colors]
                }
                placeholder={'Enter color hex code'}
                value={values.colors?.[value]}
                onChange={({ target }) =>
                  target.value[0] === '#'
                    ? setFieldValue(`colors.${value}`, target.value)
                    : setFieldValue(`colors.${value}`, `#${target.value}`)
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-8">
        <div>
          <FormFieldTitleInput
            title={'Logo padding'}
            description={'If the logo should be displayed with paddding'}
          />
          <SelectorBoolean
            handleChange={(v) => setFieldValue('logoPadding', v)}
          />
        </div>
        <div>
          <FormFieldTitleInput
            title={'Image url'}
            description={
              'Image url to be used as the icon in the pool selector and the header'
            }
          />
          <TextInput
            disabled={false}
            hasError={
              !!values.imageUrl && values.imageUrl !== '' && !!errors.imageUrl
            }
            placeholder={'Ente url'}
            value={values.imageUrl}
            onChange={(e) => {
              setFieldValue('imageUrl', e.target.value)
            }}
          />
        </div>
        <div>
          <FormFieldTitleInput
            title={'Secondary image url'}
            description={
              'Secondary image url to be used next to the icon in the pool selector and the header'
            }
          />
          <TextInput
            disabled={false}
            hasError={
              !!values.secondaryImageUrl &&
              values.secondaryImageUrl !== '' &&
              !!errors.secondaryImageUrl
            }
            placeholder={'Ente url'}
            value={values.secondaryImageUrl}
            onChange={(e) => {
              setFieldValue('secondaryImageUrl', e.target.value)
            }}
          />
        </div>
        <div>
          <FormFieldTitleInput
            title={'Background image url'}
            description={'Background image for the pool'}
          />
          <TextInput
            disabled={false}
            hasError={
              !!values.backgroundImage &&
              values.backgroundImage !== '' &&
              !!errors.backgroundImage
            }
            placeholder={'Ente url'}
            value={values.backgroundImage}
            onChange={(e) => {
              setFieldValue('backgroundImage', e.target.value)
            }}
          />
        </div>
        <div>
          <FormFieldTitleInput
            title={'Website url'}
            description={
              'Website url. If specified, will be navigated to when the image in the header is clicked'
            }
          />
          <TextInput
            disabled={false}
            hasError={
              !!values.websiteUrl &&
              values.websiteUrl !== '' &&
              !!errors.websiteUrl
            }
            placeholder={'Ente url'}
            value={values.websiteUrl}
            onChange={(e) => {
              setFieldValue('websiteUrl', e.target.value)
            }}
          />
        </div>
        <div>
          <FormFieldTitleInput
            title={'Max staked'}
            description={
              'Max staked is used to compute percentage of total staked'
            }
          />
          <NumberInput
            disabled={false}
            hasError={!!values.maxStaked && !!errors.maxStaked}
            placeholder={'Enter max staked amount'}
            value={values.maxStaked ? String(values.maxStaked) : ''}
            onChange={(e) => {
              setFieldValue('maxStaked', e.target.value)
            }}
          />
        </div>
        <AsyncButton
          loading={handlePoolConfig.isLoading}
          onClick={() => {
            handlePoolConfig.mutate({
              config: values,
            })
          }}
          inlineLoader
          className="flex w-full items-center justify-center bg-primary py-2 px-4 text-center text-white hover:bg-opacity-80"
        >
          Save Config
        </AsyncButton>
      </div>
    </div>
  )
}

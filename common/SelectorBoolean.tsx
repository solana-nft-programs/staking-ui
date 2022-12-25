import { Selector } from './Selector'

export const SelectorBoolean = ({
  handleChange,
  defaultChecked,
  ...props
}: Omit<Parameters<typeof Selector>[0], 'defaultOptions' | 'options'> & {
  handleChange: (b: boolean) => void
  defaultChecked?: boolean
}) => {
  return (
    <Selector<'yes' | 'no'>
      {...props}
      onChange={(e) => handleChange(e?.value === 'yes')}
      defaultOption={
        defaultChecked
          ? {
              value: 'yes',
              label: 'Yes',
            }
          : {
              value: 'no',
              label: 'No',
            }
      }
      options={[
        {
          value: 'yes',
          label: 'Yes',
        },
        {
          value: 'no',
          label: 'No',
        },
      ]}
    />
  )
}

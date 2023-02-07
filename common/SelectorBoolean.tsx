import { Selector } from './Selector'

export const SelectorBoolean = ({
  handleChange,
  defaultChecked,
  value,
  ...props
}: {
  handleChange: (b: boolean) => void
  defaultChecked?: boolean
  value?: boolean
}) => {
  return (
    <Selector<'yes' | 'no'>
      {...props}
      value={
        value
          ? {
              value: value ? 'yes' : 'no',
              label: value ? 'Yes' : 'No',
            }
          : undefined
      }
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

import { NumberInput } from '@/components/UI/inputs/NumberInput'
// import { SelectInput } from '@/components/UI/inputs/SelectInput'
import type { InputOption } from '@/types/index'

export type NumberInputWithSelectProps = {
  selectInputValue: string
  setSelectInputValue: (value: string) => void
  selectOptions: InputOption[]
  numberInputValue: string
  setNumberInputValue: (value: string) => void
}

export const NumberInputWithSelect = ({
  // selectInputValue,
  // setSelectInputValue,
  // selectOptions,
  numberInputValue,
  setNumberInputValue,
}: NumberInputWithSelectProps) => {
  return (
    <div className="flex">
      <NumberInput
        value={numberInputValue}
        onChange={(e) => setNumberInputValue(e.target.value)}
      />
      {/* <SelectInput
        value={selectInputValue || ''}
        setValue={setSelectInputValue}
        options={selectOptions}
      /> */}
    </div>
  )
}

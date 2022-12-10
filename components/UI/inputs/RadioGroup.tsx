import { RadioGroup as RadioGroupHeadless } from '@headlessui/react'

import type { InputOption } from '@/types/index'

export type RadioGroupProps = {
  options: InputOption[]
  onChange: (option: InputOption) => void
  selected?: { value: string; label: string }
}

export const RadioGroup = ({
  options,
  onChange,
  selected,
}: RadioGroupProps) => {
  return (
    <>
      {/* https://github.com/tailwindlabs/headlessui/issues/1523 */}
      {/* @ts-expect-error */}
      <RadioGroupHeadless value={selected || options[0]} onChange={onChange}>
        <div className="flex">
          {options.map((option, i) => (
            // https://github.com/tailwindlabs/headlessui/issues/1523
            // @ts-expect-error
            <RadioGroupHeadless.Option
              key={option.label}
              value={option}
              className={({ checked }) =>
                `${checked ? 'bg-black text-gray-400' : 'bg-gray-800'}
                ${i === 0 ? 'rounded-l-xl' : ''}
                ${i === options.length - 1 ? 'rounded-r-xl' : ''}
                     flex cursor-pointer border-4 border-gray-800 px-5 py-3 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroupHeadless.Label
                          as="p"
                          className={`rounded-xl font-medium ${
                            checked ? 'bg-black text-white' : 'text-gray-500'
                          }`}
                        >
                          {option.label}
                        </RadioGroupHeadless.Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </RadioGroupHeadless.Option>
          ))}
        </div>
      </RadioGroupHeadless>
    </>
  )
}

import { Tab } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'

export function TabButton({ children }: { children: ReactNode }) {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button className={`
          px-4 py-2 text-sm
          ${selected ? '!bg-purple-400 text-white rounded-md' : 'text-neutral-400 hover:text-neutral-300'}
        `}>
          {children}
        </button>
      )}
    </Tab>
  )
}

export function TabPanel({ children }: { children: ReactNode }) {
  return (
    <Tab.Panel className="border border-neutral-600 !w-full rounded-lg p-6 py-5 bg-neutral-900 bg-opacity-70">
      {children}
    </Tab.Panel>
  )
}
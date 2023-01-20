import { GlyphBrowse } from 'assets/GlyphBrowse'
import { ButtonSmall } from 'common/ButtonSmall'
import { TabSelector } from 'common/TabSelector'
import type { StakePool } from 'hooks/useAllStakePools'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

import { CollectionsGrid } from './CollectionsGrid'
import { CollectionsList } from './CollectionsList'

type VIEW_OPTIONS = 'grid' | 'list'
const VIEW_TABS: {
  label: JSX.Element
  value: VIEW_OPTIONS
  disabled?: boolean
  tooltip?: string
}[] = [
  {
    label: <GlyphBrowse />,
    value: 'grid',
  },
  {
    label: <AiOutlineMenu className="text-xl" />,
    value: 'list',
  },
]

export const CollectionsView = ({
  configs,
  header,
}: {
  configs?: StakePool[]
  header?: { title?: string; description?: string }
}) => {
  const [view, setView] = useState<VIEW_OPTIONS>()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(
    () =>
      view &&
      window.scrollTo({
        behavior: 'smooth',
        top: (ref.current?.offsetTop ?? 0) - 50,
      }),
    [view]
  )
  return (
    <div ref={ref}>
      <div className="flex flex-col gap-2">
        {header?.title && (
          <>
            <div className="text-5xl text-light-0">{header.title}</div>
          </>
        )}
        <div className="flex items-center justify-between">
          <div className="mb-6 text-lg text-medium-3">
            {header?.description}{' '}
          </div>
          <div className="mb-6 flex justify-end">
            <TabSelector<VIEW_OPTIONS>
              defaultOption={VIEW_TABS[0]}
              options={VIEW_TABS}
              value={VIEW_TABS.find((p) => p.value === view)}
              onChange={(o) => {
                setView(o.value)
              }}
            />
          </div>
        </div>
      </div>
      {view === 'list' ? (
        <div>
          <CollectionsList configs={configs} />
          <div className="mt-3 flex items-center justify-center text-xl">
            <ButtonSmall onClick={() => setView('grid')}>
              <div className="flex items-center px-2">
                <div>Featured</div>
                <div className="text-2xl">
                  <BiChevronUp />
                </div>
              </div>
            </ButtonSmall>
          </div>
        </div>
      ) : (
        <div>
          <CollectionsGrid configs={configs} />
          <div className="mt-3 flex items-center justify-center text-xl">
            <ButtonSmall onClick={() => setView('list')}>
              <div className="flex items-center px-2">
                <div>See all</div>
                <div className="text-2xl">
                  <BiChevronDown />
                </div>
              </div>
            </ButtonSmall>
          </div>
        </div>
      )}
    </div>
  )
}

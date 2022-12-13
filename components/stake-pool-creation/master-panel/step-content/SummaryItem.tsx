import { camelCaseToTitle } from 'common/utils'

export type SummaryItemProps = {
  item: LabelKey
  value: string
}

export enum LabelKey {
  overlayText = 'overlayText',
  requireCollections = 'requireCollections',
  requireCreators = 'requireCreators',
}

const labels = {
  overlayText: 'Overlay Text',
  requireCollections: 'Required Collections',
  requireCreators: 'Required Creators',
}

export const SummaryItem = ({ item, value }: SummaryItemProps) => {
  return (
    <div className="w-full py-1" key={item}>
      <div className="flex w-full items-center justify-between rounded-xl bg-gray-800 p-6">
        {item === LabelKey.requireCollections ||
        item === LabelKey.requireCreators ? (
          <div className="flex">
            <span className="text-gray-500">
              <>{labels[item] ? labels[item] : camelCaseToTitle(item)}:</>
            </span>
            <span className="ml-2 text-gray-200">
              {value?.length ? value : 'N/A'}
            </span>
          </div>
        ) : (
          <div className="flex">
            <span className="text-gray-500">
              <>{labels[item] ? labels[item] : camelCaseToTitle(item)}:</>
            </span>
            <span className="ml-2 text-gray-200">{value ? value : 'N/A'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

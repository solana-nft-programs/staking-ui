import { tryPublicKey } from '@cardinal/common'
import { PublicKey } from '@solana/web3.js'
import { ShortPubKeyUrl } from 'common/Pubkeys'
import { camelCaseToTitle } from 'common/utils'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Fragment } from 'react'

export type SummaryItemProps = {
  item: LabelKey
  value: string | string[]
}

export enum LabelKey {
  overlayText = 'overlayText',
  requireCollections = 'requireCollections',
  requireCreators = 'requireCreators',
  rewardDistributorKind = 'rewardDistributorKind',
  rewardMintAddress = 'rewardMintAddress',
}

const labels = {
  overlayText: 'Overlay Text',
  requireCollections: 'Required Collections',
  requireCreators: 'Required Creators',
  rewardDistributorKind: 'Reward Distribution',
  rewardMintAddress: 'Reward Mint Address',
}

export const SummaryItem = ({ item, value }: SummaryItemProps) => {
  const { environment } = useEnvironmentCtx()

  const formatPubKeys = (pubKeys: string[]) => {
    return pubKeys.map((pubKey, i) => {
      if (!tryPublicKey(pubKey)) return <></>
      return (
        <Fragment key={pubKey}>
          <ShortPubKeyUrl
            pubkey={new PublicKey(pubKey)}
            cluster={environment.label}
          ></ShortPubKeyUrl>
          {i < pubKeys.length - 1 && ', '}
        </Fragment>
      )
    })
  }

  const formatSpecialItems = (item: LabelKey, value: string | string[]) => {
    if (
      item === LabelKey.requireCollections ||
      item === LabelKey.requireCreators
    ) {
      if (!value || value.length < 1) return 'N/A'
      return formatPubKeys(value as string[])
    }
    if (item === LabelKey.rewardDistributorKind) {
      return value === '1' ? 'Mint' : 'Transfer'
    }
    if (item === LabelKey.rewardMintAddress) {
      if (!tryPublicKey(value)) return 'N/A'
      return (
        <ShortPubKeyUrl
          pubkey={new PublicKey(value)}
          cluster={environment.label}
        ></ShortPubKeyUrl>
      )
    }
  }

  return (
    <div className="w-full py-1" key={item}>
      <div className="flex w-full items-center justify-between rounded-xl bg-gray-800 p-6">
        {item === LabelKey.rewardDistributorKind ||
        item === LabelKey.requireCollections ||
        item === LabelKey.rewardMintAddress ||
        item === LabelKey.requireCreators ? (
          <div className="flex">
            <span className="text-gray-500">
              <>{labels[item] ? labels[item] : camelCaseToTitle(item)}:</>
            </span>
            <span className="ml-2 text-gray-200">
              {formatSpecialItems(item, value)}
            </span>
          </div>
        ) : (
          <div className="flex">
            <span className="text-gray-500">
              <>{labels[item] ? labels[item] : camelCaseToTitle(item)}:</>
            </span>
            {typeof value === 'boolean' ? (
              <span className="ml-2 capitalize text-gray-200">
                {value ? 'Yes' : 'No'}
              </span>
            ) : (
              <span className="ml-2 text-gray-200">
                {value ? value : 'N/A'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

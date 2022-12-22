import { tryPublicKey } from '@cardinal/common'
import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import { ShortPubKeyUrl } from 'common/Pubkeys'
import { formatMintNaturalAmountAsDecimal } from 'common/units'
import { camelCaseToTitle } from 'common/utils'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Fragment } from 'react'
import type { Mint } from 'spl-token-v3'

export type SummaryItemProps = {
  item: LabelKey
  value: string | string[]
  mintInfo?: Mint
}

export enum LabelKey {
  overlayText = 'overlayText',
  requireCollections = 'requireCollections',
  requireCreators = 'requireCreators',
  rewardDistributorKind = 'rewardDistributorKind',
  rewardMintAddress = 'rewardMintAddress',
  rewardAmount = 'rewardAmount',
  rewardMintSupply = 'rewardMintSupply',
  endDate = 'endDate',
}

const labels = {
  overlayText: 'Overlay Text',
  requireCollections: 'Allowed Collections',
  requireCreators: 'Allowed Creators',
  rewardDistributorKind: 'Reward Distribution',
  rewardMintAddress: 'Reward Mint Address',
  rewardAmount: 'Reward Amount',
  rewardMintSupply: 'Reward Mint Supply',
  endDate: 'End Date',
  maxRewardSecondsReceived: 'Maximum Reward Duration',
  minStakeSeconds: 'Minimum Stake Duration',
  requiresAuthorization: 'Mint List Enabled',
}

export const SummaryItem = ({ item, value, mintInfo }: SummaryItemProps) => {
  const { environment } = useEnvironmentCtx()

  const formatPubKeys = (pubKeys: string[]) => {
    return pubKeys.map((pubKey, i) => {
      if (!tryPublicKey(pubKey)) return <></>
      return (
        <Fragment key={pubKey}>
          <ShortPubKeyUrl
            className="text-base underline underline-offset-2"
            pubkey={new PublicKey(pubKey)}
            cluster={environment.label}
          ></ShortPubKeyUrl>
          {i < pubKeys.length - 1 && ', '}
        </Fragment>
      )
    })
  }

  const formatSpecialItems = (
    item: LabelKey,
    value: string | string[],
    mintInfo?: Mint
  ) => {
    if (
      item === LabelKey.requireCollections ||
      item === LabelKey.requireCreators
    ) {
      if (!value || value.length < 1) return '-'
      return formatPubKeys(value as string[])
    }
    if (item === LabelKey.rewardDistributorKind) {
      return value === '1' ? 'Mint' : 'Transfer'
    }
    if (item === LabelKey.rewardMintAddress) {
      if (!tryPublicKey(value)) return '-'
      return (
        <ShortPubKeyUrl
          className="text-base underline underline-offset-2"
          pubkey={new PublicKey(value)}
          cluster={environment.label}
        />
      )
    }
    if (item === LabelKey.endDate) {
      return value
        ? new Date(value.toString()).toLocaleDateString([], {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          })
        : '-'
    }
    if (item === LabelKey.rewardAmount) {
      return mintInfo
        ? formatMintNaturalAmountAsDecimal(mintInfo, new BN(value.toString()))
        : value
    }
    if (item === LabelKey.rewardMintSupply) {
      return mintInfo
        ? formatMintNaturalAmountAsDecimal(mintInfo, new BN(value.toString()))
        : value
    }
  }

  if (item === LabelKey.rewardMintSupply) {
    return <></>
  }

  return (
    <div className="w-full py-1" key={item}>
      <div className="flex w-full items-center justify-between rounded-xl bg-gray-800 p-6">
        {item === LabelKey.rewardDistributorKind ||
        item === LabelKey.requireCollections ||
        item === LabelKey.rewardMintAddress ||
        item === LabelKey.rewardAmount ||
        item === LabelKey.endDate ||
        item === LabelKey.requireCreators ? (
          <div className="flex">
            <span className="text-gray-500">
              <>{labels[item] ? labels[item] : camelCaseToTitle(item)}:</>
            </span>
            <span className="ml-2 text-gray-200">
              {formatSpecialItems(item, value, mintInfo)}
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
              <span className="ml-2 text-gray-200">{value ? value : '-'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

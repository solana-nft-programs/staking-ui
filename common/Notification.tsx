import { notification } from 'antd'
import React from 'react'

export function notify({
  message,
  description,
  txid,
  type = 'info',
  placement = 'topRight',
  cluster,
}: {
  message: string
  description?: string | JSX.Element
  txid?: string
  type?: string
  placement?: string
  cluster?: string
}) {
  // @ts-ignore
  notification[type]({
    message: <span>{message}</span>,
    description: (
      <>
        <div>{description}</div>
        {txid && (
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://explorer.solana.com/tx/${txid}${
              cluster === 'devnet' ? '?cluster=devnet' : ''
            }`}
          >
            View transaction {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
          </a>
        )}
      </>
    ),
    placement,
  })
}

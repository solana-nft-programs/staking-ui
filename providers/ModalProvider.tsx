import { Modal } from 'common/Modal'
import React, { useContext, useState } from 'react'

export interface ModalProviderValues {
  showModal: (content: JSX.Element) => void
  onDismiss: () => void
}

const ModalContext: React.Context<ModalProviderValues> =
  React.createContext<ModalProviderValues>({
    showModal: () => <></>,
    onDismiss: () => <></>,
  })

export function ModalProvider({ children }: { children: JSX.Element }) {
  const [content, setContent] = useState<JSX.Element>()
  return (
    <ModalContext.Provider
      value={{
        showModal: (content: JSX.Element) => {
          setContent(content)
        },
        onDismiss: () => setContent(undefined),
      }}
    >
      <Modal isOpen={!!content} onDismiss={() => setContent(undefined)}>
        {content}
      </Modal>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal(): ModalProviderValues {
  return useContext(ModalContext)
}

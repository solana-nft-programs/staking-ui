import { useModal } from 'providers/ModalProvider'

type Props = {
  handleAccept: () => void
}

const TermsOfService = ({ handleAccept }: Props) => {
  const { onDismiss } = useModal()

  return (
    <div className="space-y-8 rounded-xl bg-gray-900 p-12 shadow-2xl">
      <div className="flex w-full items-center justify-center py-4">
        <img
          className={`max-h-28 rounded-xl fill-red-600`}
          src={'/cardinal-crosshair.svg'}
          alt="Cardinal logo"
        />
      </div>
      <div className="p-2 text-xl leading-8">
        By connecting your wallet and using Cardinal services, you agree to our{' '}
        <a href="/docs/tos-staking.pdf" className="text-primary underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/docs/privacy-staking.pdf"
          className="text-primary underline"
        >
          Privacy Policy
        </a>
        .
      </div>
      <div className="flex w-full justify-around">
        <button
          className="w-1/3 cursor-pointer rounded-lg border bg-transparent p-3 text-light-0 transition-colors hover:bg-gray-500"
          onClick={onDismiss}
        >
          Cancel
        </button>
        <button
          className="w-1/3 cursor-pointer rounded-lg bg-primary p-3 text-light-0 transition-colors hover:bg-primary-hover"
          onClick={handleAccept}
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export const useTermsOfServiceModal = () => {
  const { showModal } = useModal()
  return {
    showModal: (params: any) => showModal(<TermsOfService {...params} />),
  }
}

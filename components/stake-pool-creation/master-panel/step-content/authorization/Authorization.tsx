// import { PlusIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { CreatorAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CreatorAddressInputs'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export const Authorization = () => {
  const [collectionAddress, setCollectionAddress] = useState('')
  const [addressToAccessMint, setAddressToAccessMint] = useState('')

  return (
    <>
      <CreatorAddressInputs />
      <div className="mb-2 flex w-full items-center">
        <LabelText>NFT collection address</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      <TextInput
        className="mb-6"
        onChange={(e) => setCollectionAddress(e.target.value)}
        value={collectionAddress}
      />
      <div className="mb-2 flex w-full items-center">
        <LabelText>Authorize access to specific mint</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      <TextInput
        onChange={(e) => setAddressToAccessMint(e.target.value)}
        value={addressToAccessMint}
      />
    </>
  )
}

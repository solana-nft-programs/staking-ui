import { AccessAuthorityInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/AccessAuthorityInputs'
import { CollectionAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CollectionAddressInputs'
import { CreatorAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CreatorAddressInputs'

export const Authorization = () => {
  return (
    <>
      <CreatorAddressInputs />
      <CollectionAddressInputs />
      <AccessAuthorityInputs />
    </>
  )
}

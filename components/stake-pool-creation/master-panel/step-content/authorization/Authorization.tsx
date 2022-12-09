import type { Dispatch, SetStateAction } from 'react'

import { AccessAuthorityInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/AccessAuthorityInputs'
import { CollectionAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CollectionAddressInputs'
import { CreatorAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CreatorAddressInputs'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type AuthorizationProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
}

export const Authorization = ({
  setActiveSlavePanelScreen,
}: AuthorizationProps) => {
  return (
    <>
      <CreatorAddressInputs
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
      />
      <CollectionAddressInputs
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
      />
      <AccessAuthorityInputs
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
      />
    </>
  )
}

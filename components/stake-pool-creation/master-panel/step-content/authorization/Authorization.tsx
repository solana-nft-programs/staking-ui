import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'

import { AccessAuthorityInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/AccessAuthorityInputs'
import { CollectionAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CollectionAddressInputs'
import { CreatorAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CreatorAddressInputs'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type AuthorizationProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
  activeSlavePanelScreen: SlavePanelScreens
}

export const Authorization = ({
  setActiveSlavePanelScreen,
  formState,
  activeSlavePanelScreen,
}: AuthorizationProps) => {
  return (
    <div className="pb-14">
      <CreatorAddressInputs
        activeSlavePanelScreen={activeSlavePanelScreen}
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
      />
      <CollectionAddressInputs
        activeSlavePanelScreen={activeSlavePanelScreen}
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
      />
      <AccessAuthorityInputs
        activeSlavePanelScreen={activeSlavePanelScreen}
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
      />
    </div>
  )
}

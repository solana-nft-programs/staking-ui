import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'

import { AccessAuthorityInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/AccessAuthorityInputs'
import { CollectionAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CollectionAddressInputs'
import { CreatorAddressInputs } from '@/components/stake-pool-creation/master-panel/step-content/authorization/CreatorAddressInputs'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type AuthorizationProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const Authorization = ({
  setActiveSlavePanelScreen,
  formState,
}: AuthorizationProps) => {
  return (
    <div className="pb-6">
      <CreatorAddressInputs
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
      />
      <CollectionAddressInputs
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
      />
      <AccessAuthorityInputs
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
      />
    </div>
  )
}

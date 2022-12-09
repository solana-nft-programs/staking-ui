import { TipOne } from '@/components/stake-pool-creation/slave-panel-content/authorization/TipOne'
import { Intro } from '@/components/stake-pool-creation/slave-panel-content/Intro'
import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type ContentPrimaryProps = {
  activeScreen: SlavePanelScreens
}

export const ContentPrimary = ({ activeScreen }: ContentPrimaryProps) => {
  const { INTRO, AUTHORIZATION_1 } = SlavePanelScreens

  return (
    <div className="z-10 flex flex-col items-center">
      {activeScreen === INTRO && <Intro />}
      {activeScreen === AUTHORIZATION_1 && <TipOne />}
    </div>
  )
}
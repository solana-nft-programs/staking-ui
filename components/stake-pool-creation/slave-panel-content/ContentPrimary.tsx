import { AuthorizationTipOne } from '@/components/stake-pool-creation/slave-panel-content/authorization/AuthorizationTipOne'
import { AuthorizationTipThree } from '@/components/stake-pool-creation/slave-panel-content/authorization/AuthorizationTipThree'
import { AuthorizationTipTwo } from '@/components/stake-pool-creation/slave-panel-content/authorization/AuthorizationTipTwo'
import { Intro } from '@/components/stake-pool-creation/slave-panel-content/Intro'
import { RewardDistributionTipOne } from '@/components/stake-pool-creation/slave-panel-content/reward-distribution/RewardDistributionTipOne'
import { RewardDistributionTipThree } from '@/components/stake-pool-creation/slave-panel-content/reward-distribution/RewardDistributionTipThree'
import { RewardDistributionTipTwo } from '@/components/stake-pool-creation/slave-panel-content/reward-distribution/RewardDistributionTipTwo'
import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type ContentPrimaryProps = {
  activeScreen: SlavePanelScreens
}

export const ContentPrimary = ({ activeScreen }: ContentPrimaryProps) => {
  const {
    INTRO,
    AUTHORIZATION_1,
    AUTHORIZATION_2,
    AUTHORIZATION_3,
    REWARD_DISTRIBUTION_1,
    REWARD_DISTRIBUTION_2,
    REWARD_DISTRIBUTION_3,
  } = SlavePanelScreens

  return (
    <div className="z-10 flex flex-col items-center">
      {activeScreen === INTRO && <Intro />}
      {activeScreen === AUTHORIZATION_1 && <AuthorizationTipOne />}
      {activeScreen === AUTHORIZATION_2 && <AuthorizationTipTwo />}
      {activeScreen === AUTHORIZATION_3 && <AuthorizationTipThree />}
      {activeScreen === REWARD_DISTRIBUTION_1 && <RewardDistributionTipOne />}
      {activeScreen === REWARD_DISTRIBUTION_2 && <RewardDistributionTipTwo />}
      {activeScreen === REWARD_DISTRIBUTION_3 && <RewardDistributionTipThree />}
    </div>
  )
}

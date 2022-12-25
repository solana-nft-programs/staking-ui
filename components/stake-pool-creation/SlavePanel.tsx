import { ContentPrimary } from '@/components/stake-pool-creation/slave-panel-content/ContentPrimary'
import FloatingBlurryBlob from '@/components/UI/FloatingBlurryBlob'
import { FloatingBlurryBlobColors } from '@/types/colors'

export enum SlavePanelScreens {
  INTRO = 'INTRO',
  AUTHORIZATION_1 = 'AUTHORIZATION_1',
  AUTHORIZATION_2 = 'AUTHORIZATION_2',
  AUTHORIZATION_3 = 'AUTHORIZATION_3',
  REWARD_DISTRIBUTION_1 = 'REWARD_DISTRIBUTION_1',
  REWARD_DISTRIBUTION_2 = 'REWARD_DISTRIBUTION_2',
  REWARD_DISTRIBUTION_3 = 'REWARD_DISTRIBUTION_3',
  REWARD_SUPPLY_1 = 'REWARD_SUPPLY_1',
  REWARD_SUPPLY_2 = 'REWARD_SUPPLY_2',
  REWARD_SUPPLY_3 = 'REWARD_SUPPLY_3',
  TIME_BASED_PARAMETERS_1 = 'TIME_BASED_PARAMETERS_1',
  TIME_BASED_PARAMETERS_2 = 'TIME_BASED_PARAMETERS_2',
  TIME_BASED_PARAMETERS_3 = 'TIME_BASED_PARAMETERS_3',
  TIME_BASED_PARAMETERS_4 = 'TIME_BASED_PARAMETERS_4',
  ADDITIONAL_STAKE_CONDITIONS_1 = 'ADDITIONAL_STAKE_CONDITIONS_1',
  ADDITIONAL_STAKE_CONDITIONS_2 = 'ADDITIONAL_STAKE_CONDITIONS_2',
  ADDITIONAL_STAKE_CONDITIONS_3 = 'ADDITIONAL_STAKE_CONDITIONS_3',
  SUMMARY = 'SUMMARY',
}

export type SlavePanelProps = {
  activeScreen: SlavePanelScreens
}

export const SlavePanel = ({
  activeScreen = SlavePanelScreens.INTRO,
}: SlavePanelProps) => {
  return (
    <div className="ml-8 hidden w-3/5 flex-col lg:flex ">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-clip rounded-2xl bg-black">
        <ContentPrimary activeScreen={activeScreen} />
        <FloatingBlurryBlob
          color={FloatingBlurryBlobColors.ORANGE}
          left={300}
          top={100}
          height={300}
          width={130}
          rotation={20}
        />
        <FloatingBlurryBlob
          color={FloatingBlurryBlobColors.ORANGE}
          left={750}
          top={500}
          height={350}
          width={240}
          rotation={40}
        />
      </div>
    </div>
  )
}

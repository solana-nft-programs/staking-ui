import { EpochInfo } from "@solana/web3.js"
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export type EpochInfoData = {
  epoch: number,
  prettyProgress: number,
  epochInfo: EpochInfo
  epochProgress: number
  epochTimeRemaining: number
  error?: string
}

export const useEpochInfo = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<EpochInfoData>(
    [
      'useEpochInfo',
    ],
    async () => {
      const epochInfo = await secondaryConnection.getEpochInfo()
      const {epoch, slotIndex, slotsInEpoch} =  epochInfo
      const epochProgress = slotIndex / slotsInEpoch
      const samples = [{samplePeriodSecs: 550, numSlots: 1000}] // Hardcoded until mystery above is solved
      const timePerSlotSamples = samples
          .filter((sample) => {
          return sample.numSlots !== 0;
          })
          .slice(0, 60)
          .map((sample) => {
          return sample.samplePeriodSecs / sample.numSlots;
          })

      const samplesInHour = timePerSlotSamples.length < 60 ? timePerSlotSamples.length : 60;
      const avgSlotTime_1h =
          timePerSlotSamples.reduce((sum: number, cur: number) => {
          return sum + cur;
          }, 0) / samplesInHour;

      const hourlySlotTime = Math.round(1000 * avgSlotTime_1h);
      const epochTimeRemaining = (slotsInEpoch - slotIndex) * hourlySlotTime;

      const prettyProgress = Math.round(Math.floor(epochProgress * 100))
      return {
          epoch,
          epochInfo,
          epochProgress,
          prettyProgress,
          epochTimeRemaining,
      };
    },
    {
      retry: 2,
    }
  )
}
  
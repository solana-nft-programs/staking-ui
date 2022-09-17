import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { LoadingSpinner } from "common/LoadingSpinner"
import { ProgressBar } from "common/ProgressBar"
import { valueOrDefault, roundTwoDigitValue } from "common/utils"
import { Button } from "components/Button"
import { SentriesDetailsData } from "hooks/useSentriesStats"
import { Rewards, SentriesStakingData, useSentryPower } from "hooks/useSentryPower"
import { ReactElement, ReactNode } from "react"

type StatsProps = {
  stakedSentries: number,
  sentriesDetails: SentriesDetailsData | undefined,
  stats: SentriesStakingData | undefined,
  isLoading: boolean,
  isError: boolean,
  recover: () => void,
}

type StatsBlock = {
  title: string,
  icon: ReactElement,
  valueAbs: number,
  valueRel: number,
  color: string,
  prefix?: string,
}

export function Stats(props: StatsProps) {
  const { stakedSentries, sentriesDetails, stats, isLoading, isError, recover } = props
  const sentryPower = useSentryPower()

  if (isLoading) {
    return (
      <Container>
        <div className="h-96 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <div className="h-96 flex justify-center items-center">
          <div className="text-white">
            <h3>Network Error</h3>
            <p className="opacity-40">There was a problem loading Sentries Stats</p>
            <Button hasArrow={true} as="button" onClick={() => recover()}>Retry</Button>
          </div>
        </div>
      </Container>
    )
  }

  const stakedSentriesPercentage = (stakedSentries * 100) / 8000
  const stakedSol = parseFloat(roundTwoDigitValue(valueOrDefault(stats?.totalStaked, 0)))
  const SolNeeded = valueOrDefault(stats?.maxPowerLevelSol, 0)
  const sentriesCount = Number(valueOrDefault(stats?.nftCount, 0))

  const solPowering = valueOrDefault(sentriesDetails?.solPowering, 0)
  const solPrice = valueOrDefault(sentriesDetails?.solPrice, 0)

  // This is going to be all the maths for calculating the % yield.
  const totalPctAllocation = sentriesCount / 8000
  const activePctAllocation = sentriesCount / stakedSentries
  const pctSolStaked = stakedSol / solPowering

  const poweredSentries = valueOrDefault(sentriesDetails?.poweredSentries, 0)
  const poweredSentriesPercentage = (poweredSentries * 100) / 8000

  const floorPrice = valueOrDefault(sentriesDetails?.floorPrice, 0)

  const currentValueLocked = floorPrice * stakedSentries * solPrice // TODO: Price of SOL
  const totalMcap = floorPrice * 8000 * solPrice // TODO: Price of SOL
  const percentMCap = (currentValueLocked / totalMcap) * 100

  const hasRewards = !!sentryPower.data?.rewards.rewardEpoch
  const totalRewards = hasRewards ? calculateTotalRewards(sentryPower?.data?.rewards as Rewards) : undefined

  const rewardRate = activePctAllocation * pctSolStaked

  let sliderPct = (stakedSol / (sentriesCount * 5))

  if((sentriesCount * 5) <= stakedSol || SolNeeded <= 1){
    sliderPct = 100
  }

  return (
    <Container>
      <div className="flex justify-center p-10 pb-0 relative -top-10">
        {/* TODO: Set this to 100% max.. this number is THEIR # of sentries * 5 SOL so SOL out of the / total SOL amount */}
        <Progress value={sliderPct} />
        <div className="absolute top-1/2 text-white text-center -translate-y-1/2 mt-12">
          <h2 className="font-serif text-8xl">{stakedSol} SOL</h2>
          <p className="text-neutral-600 font-semibold">Staked with The Lode</p>
        </div>
      </div>
      <div className="text-white text-sm text-center">
        <p className="pb-0">You current SOL staked with The Lode is {stakedSol} ◎</p>
        <p>You will need {SolNeeded} ◎ to power up the {sentriesCount} Sentries NFTs</p>
      </div>
      <div className="flex justify-between bg-[#F7B551] bg-opacity-30 border border-[#F7B551] p-4 py-3 rounded-2xl text-[#FFDEAD]">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 18.25H9C7.9 18.25 7 19.15 7 20.25V20.5H6C5.59 20.5 5.25 20.84 5.25 21.25C5.25 21.66 5.59 22 6 22H18C18.41 22 18.75 21.66 18.75 21.25C18.75 20.84 18.41 20.5 18 20.5H17V20.25C17 19.15 16.1 18.25 15 18.25H12.75V15.96C12.5 15.99 12.25 16 12 16C11.75 16 11.5 15.99 11.25 15.96V18.25Z" fill="#FFDEAD"/>
            <path d="M18.48 11.64C19.14 11.39 19.72 10.98 20.18 10.52C21.11 9.49 21.72 8.26 21.72 6.82C21.72 5.38 20.59 4.25 19.15 4.25H18.59C17.94 2.92 16.58 2 15 2H9.00003C7.42003 2 6.06003 2.92 5.41003 4.25H4.85003C3.41003 4.25 2.28003 5.38 2.28003 6.82C2.28003 8.26 2.89003 9.49 3.82003 10.52C4.28003 10.98 4.86003 11.39 5.52003 11.64C6.56003 14.2 9.06003 16 12 16C14.94 16 17.44 14.2 18.48 11.64ZM14.84 8.45L14.22 9.21C14.12 9.32 14.05 9.54 14.06 9.69L14.12 10.67C14.16 11.27 13.73 11.58 13.17 11.36L12.26 11C12.12 10.95 11.88 10.95 11.74 11L10.83 11.36C10.27 11.58 9.84003 11.27 9.88003 10.67L9.94003 9.69C9.95003 9.54 9.88003 9.32 9.78003 9.21L9.16003 8.45C8.77003 7.99 8.94003 7.48 9.52003 7.33L10.47 7.09C10.62 7.05 10.8 6.91 10.88 6.78L11.41 5.96C11.74 5.45 12.26 5.45 12.59 5.96L13.12 6.78C13.2 6.91 13.38 7.05 13.53 7.09L14.48 7.33C15.06 7.48 15.23 7.99 14.84 8.45Z" fill="#FFDEAD"/>
          </svg>
          <span className="relative top-[2px]">
            Reward Rate
          </span>
        </div>
        <span>{rewardRate}%</span>
      </div>
      <div className="mt-4 p-4 py-3 rounded-2xl font-semibold border-2 border-neutral-700 flex justify-between">
        <span className="text-neutral-500">Current Rewards</span>
        {hasRewards ? <span className="text-white">{totalRewards} <span className="opacity-50 font-normal">◎</span></span>
        : <span className="font-normal text-neutral-700 text-sm">None so far</span>}
      </div>
      <Separator />
      <StatsBlock 
        color="#9647FB"
        title="Total Sentries Staked"
        icon={
          <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.36 2.28009L6.69331 0.906758C6.3133 0.766758 5.69331 0.766758 5.3133 0.906758L1.64664 2.28009C0.939971 2.54676 0.366638 3.37342 0.366638 4.12676V9.52676C0.366638 10.0668 0.719972 10.7801 1.1533 11.1001L4.81997 13.8401C5.46664 14.3268 6.52664 14.3268 7.17331 13.8401L10.84 11.1001C11.2733 10.7734 11.6266 10.0668 11.6266 9.52676V4.12676C11.6333 3.37342 11.06 2.54676 10.36 2.28009ZM6.49997 8.08009V9.83342C6.49997 10.1068 6.2733 10.3334 5.99997 10.3334C5.72664 10.3334 5.49997 10.1068 5.49997 9.83342V8.08009C4.82664 7.86676 4.3333 7.24009 4.3333 6.50009C4.3333 5.58009 5.07997 4.83342 5.99997 4.83342C6.91997 4.83342 7.66664 5.58009 7.66664 6.50009C7.66664 7.24676 7.17331 7.86676 6.49997 8.08009Z" fill="white"/>
          </svg>
        }
        valueRel={stakedSentriesPercentage}
        valueAbs={stakedSentries}
      />
      <Separator />
      <StatsBlock 
        color="#4690C1"
        title="Powered Up Sentries"
        icon={
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.21333 9.35331H8.27333V14.1533C8.27333 14.86 9.15333 15.1933 9.62 14.66L14.6667 8.92665C15.1067 8.42665 14.7533 7.64665 14.0867 7.64665H12.0267V2.84665C12.0267 2.13998 11.1467 1.80665 10.68 2.33998L5.63333 8.07331C5.2 8.57331 5.55333 9.35331 6.21333 9.35331Z" fill="white"/>
            <path d="M5.66667 3.66699H1C0.726667 3.66699 0.5 3.44033 0.5 3.16699C0.5 2.89366 0.726667 2.66699 1 2.66699H5.66667C5.94 2.66699 6.16667 2.89366 6.16667 3.16699C6.16667 3.44033 5.94 3.66699 5.66667 3.66699Z" fill="white"/>
            <path d="M5 14.333H1C0.726667 14.333 0.5 14.1063 0.5 13.833C0.5 13.5597 0.726667 13.333 1 13.333H5C5.27333 13.333 5.5 13.5597 5.5 13.833C5.5 14.1063 5.27333 14.333 5 14.333Z" fill="white"/>
            <path d="M3 9H1C0.726667 9 0.5 8.77333 0.5 8.5C0.5 8.22667 0.726667 8 1 8H3C3.27333 8 3.5 8.22667 3.5 8.5C3.5 8.77333 3.27333 9 3 9Z" fill="white"/>
          </svg>
        }
        valueRel={poweredSentriesPercentage}
        valueAbs={poweredSentries}
      />
      <Separator />
      <StatsBlock 
        color="#01CF8E"
        title="Total Value Locked"
        icon={
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.78 4.92668C12.4933 3.48001 11.42 2.84668 9.92668 2.84668H4.07335C2.31335 2.84668 1.14001 3.72668 1.14001 5.78001V9.21335C1.14001 10.6933 1.74668 11.56 2.74668 11.9333C2.89335 11.9867 3.05335 12.0333 3.22001 12.06C3.48668 12.12 3.77335 12.1467 4.07335 12.1467H9.93335C11.6933 12.1467 12.8667 11.2667 12.8667 9.21335V5.78001C12.8667 5.46668 12.84 5.18668 12.78 4.92668ZM3.68668 8.50001C3.68668 8.77335 3.46001 9.00001 3.18668 9.00001C2.91335 9.00001 2.68668 8.77335 2.68668 8.50001V6.50001C2.68668 6.22668 2.91335 6.00001 3.18668 6.00001C3.46001 6.00001 3.68668 6.22668 3.68668 6.50001V8.50001ZM7.00001 9.26001C6.02668 9.26001 5.24001 8.47335 5.24001 7.50001C5.24001 6.52668 6.02668 5.74001 7.00001 5.74001C7.97335 5.74001 8.76001 6.52668 8.76001 7.50001C8.76001 8.47335 7.97335 9.26001 7.00001 9.26001ZM11.3067 8.50001C11.3067 8.77335 11.08 9.00001 10.8067 9.00001C10.5333 9.00001 10.3067 8.77335 10.3067 8.50001V6.50001C10.3067 6.22668 10.5333 6.00001 10.8067 6.00001C11.08 6.00001 11.3067 6.22668 11.3067 6.50001V8.50001Z" fill="white"/>
            <path d="M14.8667 7.77986V11.2132C14.8667 13.2665 13.6934 14.1532 11.9267 14.1532H6.07336C5.57336 14.1532 5.1267 14.0799 4.74003 13.9332C4.4267 13.8199 4.15336 13.6532 3.93336 13.4399C3.81336 13.3265 3.9067 13.1465 4.07336 13.1465H9.9267C12.3934 13.1465 13.86 11.6799 13.86 9.21986V5.77986C13.86 5.61986 14.04 5.51986 14.1534 5.63986C14.6067 6.11986 14.8667 6.81986 14.8667 7.77986Z" fill="white"/>
          </svg>
        }
        valueRel={percentMCap}
        valueAbs={currentValueLocked}
        prefix="$"
      />
    </Container>
  )
}

export function Progress({ value }: { value: number }) {
  const keyPoint = (1 - (+value / 100))

  return (
    <svg width="100%" height="200" viewBox="0 -6 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path id="path" d="M302 155C302 73.8141 236.186 8 155 8C73.8141 8 8 73.8141 8 155" stroke="url(#paint0_linear_172_4504)" pathLength="100" strokeWidth="15" strokeLinecap="round" />
      {value ? (
        <>
          <circle cx="0" cy="0" r="12" fill="#F7B551" stroke="white" strokeWidth="5" id="circle" className="animate-fade-in"></circle>
          <animateMotion
            dur="0.2s"
            keyPoints={`0;${keyPoint}`}
            keyTimes="0;1"
            fill="freeze"
            calcMode="linear"
            xlinkHref="#circle"
          >
            <mpath xlinkHref="#path"/>
          </animateMotion>
        </>
      ) : null}
      <defs>
      <linearGradient id="paint0_linear_172_4504" x1="308.5" y1="159.5" x2="1.00001" y2="159.5" gradientUnits="userSpaceOnUse">
      <stop stopColor="#F7B551"/>
      <stop offset="1" stopColor="#F7B551" stopOpacity="0.04"/>
      </linearGradient>
      </defs>
    </svg>
  )
}

export function StatsBlock(props: StatsBlock) {
  const { title, icon, valueAbs, valueRel, color, prefix } = props

  const formattedAbs = (prefix ? prefix : '') + valueAbs.toLocaleString()
  const formattedRel = parseFloat(valueRel.toLocaleString()).toPrecision(3) + '%'

  return (
    <div>
      <div className="flex justify-between rounded-2xl">
        <div className="flex items-center gap-4">
          {icon}
          <span className="relative top-[2px] text-neutral-400">
            {title}
          </span>
        </div>
          <span className="text-white">{formattedAbs} ({formattedRel})</span>
      </div>
      <div className="py-2">
        <ProgressBar color={color} value={valueRel} />
      </div>
    </div>
  )
}

function Separator() {
  return (
    <div className="h-[1px] w-fill bg-white my-4 bg-gradient-to-r from-neutral-800 via-neutral-500 to-neutral-800" />
  )
}

function Container({ children, ...rest }: { children: ReactNode }) {
  return (
    <div className="w-full border border-neutral-600 rounded-lg bg-neutral-900 bg-opacity-70 p-6 py-5" {...rest}>
      {children}
    </div>
  )
}

function calculateTotalRewards(rewards: Rewards) { 
  return rewards.rewardAmount.reduce((acc, curr) => acc + curr, 0) / LAMPORTS_PER_SOL
}

const rewards = {
  "rewardEpoch": [
    337,
    338,
    339,
    340,
    341,
    342,
    343,
    344,
    345,
    346,
    347,
    348
  ],
  "rewardAmount": [
    2947102,
    2994028,
    2993274,
    2926273,
    2922497,
    2910055,
    2904657,
    2883221,
    2896378,
    2894061,
    2882934,
    2889508
  ],
  "rewardPostBalance": [
    6002947102,
    6005941130,
    6008934404,
    6011860677,
    6014783174,
    6017693229,
    6020597886,
    6023481107,
    6026377485,
    6029271546,
    6032154480,
    6035043988
  ],
  "stake": [
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108,
    6.032761108
  ]
}
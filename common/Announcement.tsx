export const Announcement: React.FC = ({}) => {
  return (
    <div className="z-100 mt-4 flex w-full items-center justify-center rounded-md px-5 text-center">
      <div className="text-xs font-semibold text-yellow-500">
         is in the process of winding down protocols and UIs (
        <a
          className="text-blue-500"
          href="https://twitter.com/_labs/status/1674092964124176387?s=20"
        >
          announcement
        </a>
        ). On 7/19, all new deposit instructions will be halted. On 8/26, all
        assets will be forcibly withdrawn and returned to their depositing
        addresses. We recommend withdrawing during this period. Thank you
      </div>
    </div>
  )
}

import type { FormikHandlers, FormikState, FormikValues } from 'formik'

import type { LabelKey } from '@/components/stake-pool-creation/master-panel/step-content/SummaryItem'
import { SummaryItem } from '@/components/stake-pool-creation/master-panel/step-content/SummaryItem'

export type SummaryProps = {
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const Summary = ({ formState }: SummaryProps) => {
  const { values } = formState
  return (
    <div className="max-h-[350px] overflow-y-scroll">
      {Object.keys(values).map((item) => {
        const label = item as LabelKey
        return <SummaryItem item={label} value={values[item]} key={item} />
      })}
    </div>
  )
}

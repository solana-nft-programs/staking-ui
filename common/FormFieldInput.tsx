export const FormFieldTitleInput = (props: {
  title: string
  description: string
}) => (
  <>
    <div className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200">
      {props.title}
    </div>
    <div className="mb-2 text-sm italic text-gray-300">{props.description}</div>
  </>
)

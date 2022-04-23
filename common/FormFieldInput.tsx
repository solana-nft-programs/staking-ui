export const FormFieldTitleInput = (props: {
  title: string
  description: string
}) => (
  <>
    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200">
      {props.title}
    </label>
    <p className="mb-2 text-sm italic text-gray-300">{props.description}</p>
  </>
)

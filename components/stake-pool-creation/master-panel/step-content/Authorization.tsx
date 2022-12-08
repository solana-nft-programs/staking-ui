export type AuthorizationProps = {
  minorStep: number
}

export const Authorization = ({ minorStep }: AuthorizationProps) => {
  return <div>Auth step {minorStep}</div>
}

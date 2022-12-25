import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { TextInput } from 'components/UI/inputs/TextInput'
import { useHandleAuthorizeMints } from 'handlers/useHandleAuthorizeMints'
import { useHandleDeauthorizeMints } from 'handlers/useHandleDeauthorizeMints'
import { useState } from 'react'

export const AuthorizeMints = () => {
  const [mintsToAuthorize, setMintsToAuthorize] = useState<string>('')
  const handleAuthorizeMints = useHandleAuthorizeMints()
  const handleDeuthorizeMints = useHandleDeauthorizeMints()
  return (
    <div>
      <FormFieldTitleInput
        title={'Authorize access to specific mint'}
        description={
          <div>
            <p className="mb-2 text-sm italic text-gray-300">
              Allow any specific mints access to the stake pool (separated by
              commas)
            </p>
            <p className="mb-5 text-sm italic text-gray-300">
              <b>WARNING</b> Do not set more than a few at at time. If needed
              take a look at the scripts in{' '}
              <a
                href="https://github.com/cardinal-labs/cardinal-staking/tree/main/tools"
                className="text-blue-500"
                target="_blank"
                rel="noreferrer"
              >
                tools
              </a>{' '}
              to set many at a time.
            </p>
          </div>
        }
      />
      <TextInput
        type="text"
        placeholder={'Cmwy..., A3fD..., 7Y1v...'}
        value={mintsToAuthorize}
        onChange={(e) => {
          setMintsToAuthorize(e.target.value)
        }}
      />
      <div className="mt-3 flex items-center gap-2">
        <AsyncButton
          loading={handleAuthorizeMints.isLoading}
          onClick={() =>
            handleAuthorizeMints.mutate({
              mintsToAuthorize,
            })
          }
          inlineLoader
          className="flex w-1/2 items-center justify-center"
        >
          Authorize Mints
        </AsyncButton>
        <AsyncButton
          loading={handleDeuthorizeMints.isLoading}
          onClick={() =>
            handleDeuthorizeMints.mutate({
              mintsToAuthorize,
            })
          }
          inlineLoader
          className="flex w-1/2 items-center justify-center bg-red-500 text-center hover:bg-red-600"
        >
          De-authorize Mints
        </AsyncButton>
      </div>
    </div>
  )
}

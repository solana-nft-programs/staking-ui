import { AsyncButton } from 'common/Button'
import { useHandleAuthorizeMints } from 'handlers/useHandleAuthorizeMints'
import { useHandleDeauthorizeMints } from 'handlers/useHandleDeauthorizeMints'
import { useState } from 'react'

export const AuthorizeMints = () => {
  const [mintsToAuthorize, setMintsToAuthorize] = useState<string>('')
  const handleAuthorizeMints = useHandleAuthorizeMints()
  const handleDeuthorizeMints = useHandleDeauthorizeMints()
  return (
    <div className="mt-5">
      <label
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
        htmlFor="require-authorization"
      >
        Authorize access to specific mint
      </label>
      <p className="mb-2 text-sm italic text-gray-300">
        Allow any specific mints access to the stake pool (separated by commas)
      </p>
      <p className="mb-5 text-sm italic text-gray-300">
        <b>WARNING</b> Do not set more than a few at at time. If needed take a
        look at the scripts in{' '}
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
      <input
        className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
        type="text"
        placeholder={'Cmwy..., A3fD..., 7Y1v...'}
        value={mintsToAuthorize}
        onChange={(e) => {
          setMintsToAuthorize(e.target.value)
        }}
      />
      <div className="flex items-center gap-4">
        <AsyncButton
          loading={handleAuthorizeMints.isLoading}
          onClick={() =>
            handleAuthorizeMints.mutate({
              mintsToAuthorize,
            })
          }
          inlineLoader
          className="w-max"
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
          className="color-dark-4 w-max"
        >
          De-authorize Mints
        </AsyncButton>
      </div>
    </div>
  )
}

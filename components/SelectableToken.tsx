import { TokenData } from 'api/types'

export const SelectableToken = (
  token: TokenData,
  selectedTokens: TokenData[]
) => {
  function selectToken(tk: TokenData) {
    if (
      selectedTokens.filter(
        (x) =>
          x.tokenAccount?.pubkey.toString() ===
          tk.tokenAccount?.pubkey.toString()
      ).length > 0
    ) {
      selectedTokens = selectedTokens.filter(
        (x) =>
          x.tokenAccount?.pubkey.toString() !==
          tk.tokenAccount?.pubkey.toString()
      )
    } else {
      selectedTokens.push(tk)
    }
  }

  return (
    <div className="relative" key={token?.tokenAccount?.pubkey.toBase58()}>
      <label
        htmlFor={token?.tokenAccount?.pubkey.toBase58()}
        className="relative"
      >
        <div className="relative">
          <img
            className="mt-2 rounded-lg"
            src={token.metadata?.data.image}
            alt={token.metadata?.data.name}
          ></img>

          <input
            type="checkbox"
            className="absolute top-[8px] right-[8px] h-4 w-4 rounded-sm text-green-600"
            id={token?.tokenAccount?.pubkey.toBase58()}
            name={token?.tokenAccount?.pubkey.toBase58()}
            onChange={() => {
              selectToken(token)
            }}
          />
        </div>
      </label>
    </div>
  )
}

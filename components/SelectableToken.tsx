import { TokenData } from "api/types"

export const SeelectableToken = (
token: TokenData
) => {

    function selectToken(token: TokenData) {
        console.log("selected token", token)
    }

    return (
        <div
            className="relative"
            key={token?.tokenAccount?.pubkey.toBase58()}
        >
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
                // checked={isJamboSelected(token)}
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
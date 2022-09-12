import { useQuery } from 'react-query'

export type ValidatorInfoData = {
  address: string
  totalStakedAccounts: number
  totalSolStaked: number
  error?: string
}

export const useValidatorInfo = () => {
  return useQuery<ValidatorInfoData | undefined>(
    ['useSentriesStats'],
    async () => {
      return await fetch(
        `/v1/validator/LodezVTbz3v5GK6oULfWNFfcs7D4rtMZQkmRjnh65gq` // TODO: Changeme
      )
        .then((response) => response.json())
        .then((data) => {
          return data
        })
    },
    {
      retry: 2,
    }
  )
}

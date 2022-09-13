import { useQuery } from 'react-query'

export type ValidatorInfoData = {
  address: string
  totalStakedAccounts: number
  totalSolStaked: number
  error?: string
}

export const useValidatorInfo = () => {
  return useQuery<ValidatorInfoData | undefined>(
    ['useValidatorInfo'],
    async () => {
      return await fetch(
        `/v1/validator/LodezVTbz3v5GK6oULfWNFfcs7D4rtMZQkmRjnh65gq`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          return data
        })
    },
    {
      retry: 2,
    }
  )
}

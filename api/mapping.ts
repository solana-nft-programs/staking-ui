import { PublicKey } from '@solana/web3.js'

export const poolMapping: {
  name: string
  displayName: string
  pool: PublicKey
}[] = [
  {
    name: 'cardinal',
    displayName: 'Cardinal',
    pool: new PublicKey('9Kkq4sMQUmxsqKHRk3iJXQwQ7Bfv9N9oV4jkftpuvEvv'),
  },
  {
    name: 'jambo',
    displayName: 'Jambo Mambo',
    pool: new PublicKey('9L86DUzzHDQtWyhooEj7d6g44aSqCGYf49WFRkdTyJnt'),
  },
]

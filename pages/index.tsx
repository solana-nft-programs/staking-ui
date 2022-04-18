import Link from "next/link"

const Landing = () => {
  return (
    <div className="container mx-auto my-10">
      <p className="text-xl mb-10">Welcome to Cardinal Staking</p>
      
      <p className="text-lg">Build a new staking pool with our <Link href="/admin">Admin Page</Link></p>
      <p className="text-lg">After creating a new staking pool, save the Stake Pool ID. Access your Stake Pool UI: /[stake_pool_id]</p>

      <p className="text-lg"> View our default Stake Pool UI: <Link href="/cardinal">Cardinal's Stake Pool</Link></p>
    </div>
  )
}

export default Landing

# Cardinal Staking

[![License](https://img.shields.io/badge/license-AGPL%203.0-blue)](https://github.com/cardinal-labs/cardinal-staking/blob/master/LICENSE)
[![Release](https://github.com/cardinal-labs/cardinal-staking/actions/workflows/release.yml/badge.svg?branch=v0.0.27)](https://github.com/cardinal-labs/cardinal-staking/actions/workflows/release.yml)

<p align="center">
    <img src="./images/banner.png" />
</p>

<p align="center">
    An open protocol for staking NFTs and FTs.
</p>

## Background

Cardinal staking encompasses a suite of contracts for issuing and staking NFTs and FTs. The simple program is a stake pool that tracks total stake duration. In addition, there is an implementation of a token minting reward distributor. Cardinal staking works well with any standard NFT collection and also composes with other programs in the Cardinal NFT infrastructure ecosystem.

## Packages

| Package                       | Description                              | Version                                                                                                                           | Docs                                                                                                             |
| :---------------------------- | :--------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `cardinal-stake-pool`         | Stake pool tracking total stake duration | [![Crates.io](https://img.shields.io/crates/v/cardinal-stake-pool)](https://crates.io/crates/cardinal-stake-pool)                 | [![Docs.rs](https://docs.rs/cardinal-stake-pool/badge.svg)](https://docs.rs/cardinal-stake-pool)                 |
| `cardinal-reward-distributor` | Simple token minting rewards distributor | [![Crates.io](https://img.shields.io/crates/v/cardinal-reward-distributor)](https://crates.io/crates/cardinal-reward-distributor) | [![Docs.rs](https://docs.rs/cardinal-reward-distributor/badge.svg)](https://docs.rs/cardinal-reward-distributor) |
| `@cardinal/staking`           | TypeScript SDK for staking               | [![npm](https://img.shields.io/npm/v/@cardinal/staking.svg)](https://www.npmjs.com/package/@cardinal/staking)                     | [![Docs](https://img.shields.io/badge/docs-typedoc-blue)](https://cardinal-labs.github.io/cardinal-staking/)     |

## Addresses

Program addresses are the same on devnet, testnet, and mainnet-beta.

- StakePool: [`stkBL96RZkjY5ine4TvPihGqW8UHJfch2cokjAPzV8i`](https://explorer.solana.com/address/stkBL96RZkjY5ine4TvPihGqW8UHJfch2cokjAPzV8i)
- RewardDistributor: [`rwdNPNPS6zNvtF6FMvaxPRjzu2eC51mXaDT9rmWsojp`](https://explorer.solana.com/address/rwdNPNPS6zNvtF6FMvaxPRjzu2eC51mXaDT9rmWsojp)

## Plugins

Cardinal stake pool is meant to be composable. A simple reward distributor is provided out of the box, but any complex reward distribution logic can be implemented in a similar manner. Other implementations of other reward distributors are welcomed and encouraged. Examples that could be built:

- Tiered reward system that distributes rewards based on specified stake tiers
- Arbitrary non-linear reward functions
- NFT mutator that modifies metadata based on stake duration
- Probabilistic distributor that may or may not give a reward depending on the outcome of a random iteration. This could apply to a quest or mission with a given probability of success

## Documentation

**Stake Pool**

Stake pools are the base component of staking. A stake pool, as it sounds, is a PDA owned by the stake pool program containing the following fields

```
#[account]
pub struct StakePool {
    pub bump: u8,
    pub identifier: u64,
    pub authority: Pubkey,
    pub requires_creators: Vec<Pubkey>,
    pub requires_collections: Vec<Pubkey>,
    pub requires_authorization: bool,
    pub overlay_text: String,
    pub image_uri: String,
    pub reset_on_stake: bool,
    pub total_staked: u32,
    pub cooldown_seconds: Option<u32>,
    pub min_stake_seconds: Option<u32>,
}
```

Requires_creators, requires_collections and requires_authorization are the 3 different ways that a stake pool can gate which NFTs can be staked in the pool.

- requires_creators
  - As it sounds, this is a filter on the NFT "creators" array (as stored in metaplex metadata https://docs.metaplex.com/token-metadata/specification).
  - If this is set, any NFT with a creator that is listed in the array will be allowed to stake in the pool.
  - If your NFT was minted via Metaplex Candy Machine, you will likely want to use the candy machine ID in the requires_creator array.
  - The stake pool enforces that creators are verified.
- required_collections
  - This is a filter on the collection of an NFT that uses the Metaplex Collections standard https://docs.metaplex.com/token-metadata/specification.
  - The stake pool enforces that collections are verified.
- requires_authorization
  - If none of the above checks pass, a final check can be made to allow-list arbitrary mintIDs. The authority of a pool can set requires_authorization to TRUE and then allow-list any mint using the authorize_mint instruction.
  - This is purely additive, so if you want add more mints in addition to those passing the creators/collections check, you can leverage this feature.
  - Requires authorization can be used when the requires_creators and required_collections arrays are empty to enforce a random mint list.

Overlay text is used when creating receipts. This text will be automatically displayed on top of the NFT to indicate it is currently staked. For example, it could be "STAKED" or "TRAINING" as shown below.

<div style="text-align: center; width: 100%;">
  <img style="height: 250px" src="./images/example-staked.png" />
</div>

Reset_on_stake, cooldown_period and min_stake_seconds are three additional functionalities you can add to your pool.

- reset_on_stake
  - Resets the total stake seconds of a mint every time it gets staked.
- cooldown_seconds
  - Number of seconds to "cool down" (unstaked, but still in the pool) once user unstakes a mint
- min_stake_seconds.
  - Number of seconds a mint has to stay in the pool once staked before being able to be unstaked.

**Stake Entry**

Stake pools are a collection of stake entries. Each stake entry stores information related to a specific NFT and how long it has been staked.

Every time a new NFT is staked, a stake entry must first be created. This can happen in a single transaction by combining the `init_entry` with `stake` instructions. If a receipt mint is created, the current client will do this in two transactions due to compute limitations.

Stake entries also retain ownership of the given mint(s) while it is staked.

There are separate instructions for `stake` and `claim_receipt_mint`. Read below to learn more about receipts. The client will automatically stake the NFT and then optionally claim a receipt that can either contain the "orginal" mint OR a dynamic/mutable copy receipt mint.

Either or both of these mints must be returned to the `stake_entry` before the user can unstake. This will be done automatically when calling the `unstake` API.

```
#[account]
pub struct StakeEntry {
    pub bump: u8,
    pub pool: Pubkey,
    pub amount: u64,
    pub original_mint: Pubkey,
    pub original_mint_claimed: bool,
    pub last_staker: Pubkey,
    pub last_staked_at: i64,
    pub total_stake_seconds: i128,
    pub stake_mint_claimed: bool,
    pub kind: u8,
    pub stake_mint: Option<Pubkey>,
}
```

**Stake Receipts**

Stake pool is designed to support general staking as well as a enable the concept of stake receipts.

> Receipts is a feature that allows the user to have a representation of the staked NFT in their wallet

- `ReceiptType::Original`

  - When staking using the original receipt type, the user's token(s) will be locked into the staker's wallet, and the stake timer will begin.
  - This allows users to continue holding their tokens while they're staked which can be advantageous for several reasons including allowing them to continue participating in DAOs and gated discord servers.
  - While it does sit in their wallet, the token is frozen while it is staked and thus cannot be traded/sent to anyone else. The locked aspect of staking that projects hope to achieve is thus not compromised in any way.
  - In order to unstake, this locked token must first be unfrozen and returned to the stake pool. The current implementation leverages the Cardinal Token Manager and the invalidation type of "Return". The way this works is that upon staking, the token is issued back to the staker from the stake pool with an associated Token Manager wrapper. Then, when the user decides to unstake, the token manager is invalidated, and the token is programatically returned back to the pool. Now back in the pool and unwrapped, the token can be freely claimed by user. The client abstracts this invalidation and return inside of the unstake api.

- `ReceiptType::Receipt`
  - Optionally, the user can also claim a generated, dynamic NFT receipt.
  - Using stake type of receipt, a new copy NFT will be transferred to user. The receipt metadata is dynamic by default and uses the Cardinal metadata and img-generators hosted at https://api.cardinal.so/metadata and https://api.cardinal.so/img respectively.
  - This approach is additionally beneficial because the receipt can be clearly identified in the wallet as a staked NFT rather than a just locked one because of the mutable and dynamic nature of its metadata that allows for relevant markers/metrics to be displayed.
  - The current staker can unstake at any time which increments the stake timer for that mint.
  - Any unstaking requires returning the receipt before the unstake instruction can be called. This can be done via the Cardinal Token Manager with 'InvalidationType::Return'. Similar to how returning locked tokens works, this will is handled automatically by the client unstake api.

**Reward Distributors**

While just using the `stake_pool` can be sufficient to keep track of total stake duration and lock the NFT in the user's wallet, a reward distributor can be optionally added to distribute rewards to staked NFTs.

Reward distributor is modeled similar to a stake pool, having both a `reward_distributor` and a `reward_entry`. The reward entry is unique for each mint and keeps track how many reward have been given out to that NFT to ensure that it gets its fair share.

As mentioned above, reward distibutor is a basic example of a fixed linear payout structure, but modeling this as a separate program allows for arbitrary pluggable reward logic for reward distribution.

```
#[account]
pub struct RewardDistributor {
    pub bump: u8,
    pub stake_pool: Pubkey,
    pub kind: u8,
    pub authority: Pubkey,
    pub reward_mint: Pubkey,
    pub reward_amount: u64,
    pub reward_duration_seconds: u64,
    pub rewards_issued: u64,
    pub max_supply: Option<u64>,
    pub default_multiplier: u64,
    pub multiplier_decimals: u8,
}
```

```
#[account]
pub struct RewardEntry {
    pub bump: u8,
    pub stake_entry: Pubkey,
    pub reward_distributor: Pubkey,
    pub reward_seconds_received: u64,
    pub multiplier: u64,
}
```

The reward distributor also can be of 2 different kinds, `Mint` or `Treasury` / `Transfer`

- Mint
  - If choosing reward distributor of kind Mint, the mint authority of the reward_mint will be transfered to the reward distributor upon initialization.
  - This means that it can mint unlimited tokens to stakers up until an optional `max_supply`
  - The authority (creator) of this reward distributor can always reclaim the `mint_authority` by closing the `reward_distributor` using the `close` instruction.
- Treasury / Transfer
  - With this kind, an initial supply of tokens of the given reward_mint will be transferred to the `reward_distributor` upon intialization.
  - The reward distributor will be able to distribute rewards from its treasury / supply until it runs out or hits an optional `max_supply`.
  - If the reward distributor is running out of tokens, anyone can simply transfer more tokens to it directly via a wallet using the transfer instruction. The tokens are held in the `associated_token_account` of the `reward_distributor` for the `reward_mint`.

In both kinds of reward distributors, if the `max_supply` is hit, or the treasury runs out, the remaining rewards will be given out and the `reward_seconds_received` will be partially updated.

Because reward distributor is modeled separately from the stake_pool, a user can optionally claim their rewards at any time for the amount of time they have staked. Typically, this is done automatically when calling `unstake` by the client.

**Reward Distributor Multipliers**

Multipliers is a feature that can set a given token (via its reward_entry) to receive more rewards than the others. A reward distributor has two fields one for the `default_multiplier`, defaults to `1`, and another for the `multiplier_decimals`, defaults to `0`. Every time a reward entry is initialized, its multiplier gets set to the `default_multiplier` of its reward distributor. Only the authority of the pool can change the multiplier by calling `update_reward_entry` instruction. In the calculation of the claimable rewards for an entry, the `multiplier` is divided by ten to the power of the distributor's `multiplier_decimals`, achieving the outcome of decimal multipliers.

- Modeling this separately allows for either 1) the user to initialize their own reward_entries and the authority to update their multiplier later on or 2) the authority to run arbitrary events / bonuses for specific NFTs at any time.
- In addition, the authority may initialize all the entries up front and set the correct / desired multipliers for their NFTs such that it will correctly allocate when the user first stakes.

## Questions & Support

If you are developing using Cardinal staking contracts and libraries, feel free to reach out for support on Discord. We will work with you or your team to answer questions, provide development support and discuss new feature requests.

For issues please, file a GitHub issue.

> https://discord.gg/byq6uNTugq

## License

Cardinal Protocol is licensed under the GNU Affero General Public License v3.0.

In short, this means that any changes to this code must be made open source and available under the AGPL-v3.0 license, even if only used privately.

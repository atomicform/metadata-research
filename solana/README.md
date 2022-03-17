# Solana API Options and Evaluation

We are currently evaluationg two options to retrieve Solana NFT metadata. The Metaplex API and The Blockchain API appear to be capable of performing the same tasks. These examples and evaluation will shed light on the better of the two.

## The Blockchain API

### Resources

- API documentation: <https://docs.theblockchainapi.com/>
- Sample code: <https://github.com/BL0CK-X/blockchain-api/blob/main/examples/solana-wallet/get-wallet-nfts/js_example.js>
- API keys: <https://dashboard.blockchainapi.com/#api-keys>
- Billing/Pricing: <https://dashboard.blockchainapi.com/#resources>

### Setup and Run

`npm install theblockchainapi`

An API pair is required for The Blockchain API and Solana. Add a .env file with the following syntax

```
SOLANA_KEY_ID=""
SOLANA_KEY_SECRET=""
```
To run: `node solana/solana_tba.js`.

The data can be pulled into a file using `node solana/solana_tba.js`.

### Evaluation

Pros
- Implementation was fairly easy.
- From the website: "Our mission is to make it easy to access layer 1 protocols (e.g., Solana, Ethereum, Bitcoin, etc.), layer 2 protocols (e.g., Arbitrum, Harmony, etc.), and DeFi protocols (e.g., Uniswap, Aave, Compound, etc.) with a simple API. We're starting first with a Solana API."
  - Could be used for multiple chains?

Cons
- The API dashboard can only be logged into using google. This makes sharing the dashboard among a company very difficult. However, the API keys can still be shared.

Not sure if a pro or con
- The API requires a user/key pair.

## Metaplex API

There was no clear way to use the Metaplex SDK to query wallet NFTs.

## nfteyez sol-rayz

### Resources

- Article that lead me to this API: <https://avinashvazratkar446022.medium.com/how-to-fetch-all-collectibles-from-phantom-wallet-connected-to-solana-network-62dffb70f26b>
- RepoHub: <https://reposhub.com/javascript/misc/NftEyez-sol-rayz.html#articleHeader2>
- Github: <https://github.com/NftEyez/sol-rayz>
- Example of package in use: https://nfteyez.global/

### Setup and Run

```
npm i @solana/web3.js
npm i @nfteyez/sol-rayz
```

To run: `node solana/solana_nfteyez.js`.

### Evaluation

Pros
- Implementation was fairly easy.
- No paid tier. Appears to be free.

Cons
- I do not see SLA info but this may be a simple code package that will work with the Solana as long as no surprise changes are made. It appears to be used and maintained.

Not sure if a pro or con
- There are not credentials. The API is open.

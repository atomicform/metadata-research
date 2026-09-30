# CLAUDE.md — metadata-research

**Tier:** retired product line
**Category:** Device era (2021-23)
**Default branch:** `main` · **Last push:** 2022-04-22
**Verified against:** commit `e3347a05b438` (origin/main) on 2026-09-28
**Estate report:** `docs/estate/estate-inventory.md` in `atomicform/atomicform-claude`

## What this is

Research scripts and saved results (package name `nft-metadata`) from a February to April 2022 study of how NFT metadata is structured and where it is stored. Node scripts pull the NFTs held by chosen wallet addresses from Alchemy, OpenSea, Zora's metadata parser and two Solana sources, classify where the token URI and media are stored (IPFS, Arweave, AWS, on-chain and others), and write JSON into `nftDatasets/`, which was then flattened to CSV for spreadsheet analysis. Markdown notes compare Solana and Klaytn API options.

Stack: Node.js ES modules with top-level await; axios, dotenv, opensea-js, web3, @zoralabs/nft-metadata, theblockchainapi, @nfteyez/sol-rayz, file-type, json2csv. The README covers part of what is here.

Open first:

- `zora/enrichedZora.js` — the fullest analysis script: URL-field detection and storage-type classification
- `alchemy/enrichedMetadata.js` — adds Alchemy metadata, storage type and MIME type to the OpenSea dataset
- `opensea/opensea.js` — collects a wallet's assets from OpenSea, the input to the other scripts
- `solana/README.md` — written comparison of the Solana API options

## Status and tier

- **Liveness:** unverified — source: none. No webhook, deployment record, or hosting configuration exists.
- From the display-device period (2022). Research scripts and saved datasets; the files hold no device code. 39 commits between 25 February 2022 and 14 April 2022, 5 branches.
- This repository is public.
- **Archive:** recommended in the estate inventory. Archiving is reversible and changes nothing inside the repository.
- opensea/opensea.js names the atomicform-api repository in a comment; no script calls it.

## How it runs

Not run during this inventory. These are the commands the repository defines.

```bash
node opensea/opensea.js
node alchemy/alchemy.js
node alchemy/enrichedMetadata.js
node zora/zora.js
node zora/enrichedZora.js
node solana/solana_tba.js
```

Run from the repository root, because the scripts read and write `./nftDatasets/` by relative path. Needs `npm install` and a `.env` file holding the provider keys; `.env` is gitignored and absent from a clone. The wallet addresses queried are written into each script. `nftDatasets/` holds 62 files totalling about 120 MB of saved API responses, five of them over 10 MB each. The only package script is the default `test` placeholder. The README lists four provider folders and does not mention `atomicform-scripts/` or the Klaytn notes. KLAYTN_README.md names KLAYTN_KEY_ID and KLAYTN_KEY_SECRET, and no script reads them. The curl commands in KlaytnAPI.txt and nftDatasets/klaytnNFTMetadata carry an uppercase placeholder in the authentication position, not a literal key pair.

Environment variables the code reads: `ALCHEMY_KEY`, `OPENSEA_KEY`, `SOLANA_KEY_ID`, `SOLANA_KEY_SECRET`.

## Talks to

- **Calls:** nothing else in the estate that the files show.
- **Called by:** no file in the production, supporting, or reference repositories names this repository.
- **External services:** Alchemy, OpenSea API, Infura, Zora nft-metadata parser, The Blockchain API, Solana, Arweave, Klaytn API Service (notes only).

## Do not

- This repository is public. Anything committed here is published, and so is its history.
- `nftDatasets/` — saved API responses listing the NFT holdings of specific public wallet addresses, with OpenSea owner usernames, wallet addresses and profile image URLs. It is already public; do not enrich it, join it to other data, or pin it anywhere else.
- `opensea/opensea.js` — a collector's public name beside the wallet address queried. It is already public; do not enrich it, join it to other data, or pin it anywhere else.
- Collects third-party NFT metadata and asset listings for chosen wallet addresses from the Alchemy, OpenSea, Zora and Solana APIs and saves the responses in nftDatasets/. Check the source's terms before running it.
- Do not treat this as part of the live Lore system. Production is `atomic-lore` and `lore-api`.

## Read next

- The estate report (pointer above).
- The estate report's device-era table, which lists the other repositories in this line.

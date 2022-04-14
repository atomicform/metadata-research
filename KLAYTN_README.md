# Klaytn API Options and Evaluation

We are currently evaluating two options to retrieve Klaytn NFT metadata. These examples and evaluation will shed light on the options.

## Klaytn API

### Resources

- [DEV Documentation](https://www.klaytn.com/developers)
- [Klaytn Documentation](https://docs.klaytn.com)
- [API keys](https://dashboard.blockchainapi.com/#api-keys) (check 1password)
- [SDK w/caver-js](https://medium.com/klaytn/common-architecture-of-caver-a714224a0047)
- [Klaystagram Tutorial](https://docs.klaytn.com/dapp/tutorials/klaystagram)

### Setup and Run

You will need to get KLAY into a wallet, which you can obtain at: https://docs.klaytn.com/dapp/developer-tools/klaytn-wallet#how-to-receive-baobab-testnet-klay. 

$ npm install caver-js

An API pair is required for The Blockchain API and Klaytn. 

```
KLAYTN_KEY_ID=""
KLAYTN_KEY_SECRET=""
```
### Interesting Items Klaytn does
KIP-17, KIP-37 (Mostly from ERC-1155), and KIP-7 are the different NFT specs offered on Klaytn that are based on the ERC-721 and . More on other things found interesting about Klaytn can be found in the Google Docs as well, seen here: https://docs.google.com/document/d/1eTSmgUxIzRgQZ2TiB5MotxiJ8NdjRGzgOMt8ms3b-dg/edit?usp=sharing.

## KIP-17 
This spec is designed to help manage contracts and tokens for BApp development and heavily based on ERC-721. This is Klaytn's own version of a Non-Fungible Token that has essentially the same API endpoints as the other standards. Another interesting aspect is aliases, instead of using a contract hash, can just provide an alias given to a contract.

Additionally, one cool aspect is, you can pay transaction (gas) fee's using the KAS Global FeePayer, User FeePayer, KAS Global FeePayer Account + User FeePayer Account, and/or the standard transaction fee right from the users account. "... by using Global Fee Payer, you don’t have to worry about all the possible issues related to Fee management. You’ll be also charged the amount of Fee you used later, which means KAS pays your Fee first with KLAY at first and later on continues to charge your fee.". The FeePayer has parts like a GSN (Gas Station Network), where it helps you pay for transactions in KLAY. For more on delegation, can visit: https://docs.klaytn.com/klaytn/design/transactions#fee-delegation. 

## KIP-7
Much like KIP-17, this is designed more of the Fungible Token side and very similar to ERC-20. Same endpoints avaiable but also help manage an FT (mint, send, and burn). This too also has aliases you can reference contracts by. A deployer is also created when you make a contract which helps you manage contracts and can be used by the KIP7Deployer (https://refs.klaytnapi.com/en/kip7/latest#operation/GetDefaultDeployer) that helps with Token functionality. 

## KIP-37
Like KIP-7 but this spec is mostly ideal for Multi Tokens (similar to ERC-1155) and has the same endpoints as KIP-7 with the ability to have an alias and designated deployer. With v2, it also permits an ownable interface like you see on most EVM's with smart contracts, where the owner is the deployer (msg.sender) but also has capabilities you see in traditional ERC20 contracts, the ability to transfer ownership. The main highlight of v1 vs v2 is only the ownerable but also v1, unlike v2 permits being edited [collection] via OpenSea. "Smart contracts implementing the KIP-37 standard MUST implement the KIP-13 supportsInterface function and MUST return the constant value true if 0x6433ca1f is passed through the interfaceID argument".

## OpenSea, see's Klaytn!
To freely trade, you'll need Kaikas and MetaMask browser extentions. You'll want to use KLAYswap and Orbit Bridge to transfer your Klaytn tokens to your Kaikas wallet. After you've connected using Kaikas, you can search for NFT's on OpenSea by keyword (e.g. Klaytn, KLAY, etc). You can do the normal buy/offer via OpenSea in which you then will need to convert KLAY to WKLAY and sign the transaction as you would with MetaMask or any other eth-like wallet. After you've performed whatever buy/sell you were looking to do using KLAY, you can view the transactions via Scope on OpenSea.

## Keyring, in Code!

You can have multiple keys to an account and roles or a Single Keyring, like seen below...

You need to create a Keyring for transactions, different options exist but to make a SingleKeyring you can do so by the following:

$ touch keyring.js && code keyring.js

	// test.js

	const Caver = require('caver-js')

	const caver = new Caver('https://api.baobab.klaytn.net:8651/')

	async function testFunction() {

		const keyring = caver.wallet.keyring.generate()
	
		console.log(keyring)
	
	}

	testFunction()

$ node test.js

CONNECT TO IPFS via CAVER

If you wish to connect to a local node or remote IPFS node, you can do so by running:

	caver.ipfs.setIPFSNode('localhost', 5001, false)

IPFS: Get file address by IPFS hash as Buffer

	caver.ipfs.get('CID-HASH-HERE')


### Evaluation

Pros
- The API requires a user/key pair, making it easy to make queries to the API.
- Multiple accounts can be under a "Master" account.
-- Klaytn lets you manage multiple accounts under a main account ("Master") and easily create additional ones under this "Master" account by running > personal.newAccount() or even import other accounts you may have by Private Key. When you wish to use a certain account, you can also unlock it and for a specific amount of time (e.g. > personal.unlockAccount({address}, "password", # Seconds) but not recommended to perform in the JS console as the password becomes exposed when using the JS Console.

Cons
- Content in foreign language and need to convert all the time in the Control Panel.
- Not very straight forward on how to query NFT contracts or which API's to use from the Docs, need to vist the API pages and the queries don't provide a ton of data.

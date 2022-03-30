# Klaytn API Options and Evaluation

We are currently evaluating two options to retrieve Klaytn NFT metadata. These examples and evaluation will shed light on the options.

## Klaytn API

### Resources

- [DEV Documentation](https://www.klaytn.com/developers)
- [Klaytn Documentation](https://docs.klaytn.com)
- [API keys](https://dashboard.blockchainapi.com/#api-keys) (check 1password)
- [SDK w/caver-js] (https://medium.com/klaytn/common-architecture-of-caver-a714224a0047)
- [Klaystagram Tutorial](https://docs.klaytn.com/dapp/tutorials/klaystagram)

### Setup and Run

You will need to get KLAY into a wallet, which you can obtain at: https://docs.klaytn.com/dapp/developer-tools/klaytn-wallet#how-to-receive-baobab-testnet-klay. 
$ npm install caver-js

An API pair is required for The Blockchain API and Klaytn. 

```
KLAYTN_KEY_ID=""
KLAYTN_KEY_SECRET=""
```

You need to create a Keyring for transaction, different options exist but to make a SingleKeyring you can do so by the following:

$ touch keyring.js
$ code keyring.js

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

Cons
- Content in foreign language and need to convert all the time
- Not very straight forward on how to query NFT contracts or which API's to use
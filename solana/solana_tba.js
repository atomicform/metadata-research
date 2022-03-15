import 'dotenv/config';
import theblockchainapi from 'theblockchainapi';
import fs from "fs";
import fetch from 'node-fetch';

let defaultClient = theblockchainapi.ApiClient.instance;

// Get a free API Key Pair here: https://dashboard.blockchainapi.com/api-keys

let APIKeyID = defaultClient.authentications['APIKeyID'];
APIKeyID.apiKey = process.env.SOLANA_KEY_ID;

let APISecretKey = defaultClient.authentications['APISecretKey'];
APISecretKey.apiKey = process.env.SOLANA_KEY_SECRET;

let apiInstance = new theblockchainapi.SolanaWalletApi();
let network = 'mainnet-beta'; // String | The network ID (devnet, mainnet-beta)
let publicKey = '8WRsGBaDcs1X7bHWr4Ad5Nx3bW29BkcmEbyavrLXDC4i'; // String | The public key of the account whose list of owned NFTs you want to get

const result = await apiInstance.solanaGetNFTsBelongingToWallet(network, publicKey).then((data) => {
  console.log('API called successfully.');
  return data;
}, (error) => {
  console.error(error);
  return error;
});

let nftData = result.nfts_metadata;

for (let index = 0; index < nftData.length; index++) {console.log(nftData[index].data.uri);
  const metadataCall = await fetch(nftData[index].data.uri);
  const metadataCallData = await metadataCall.json();
  nftData[index].metaResult = metadataCallData;
}

fs.writeFileSync(`./nftDatasets/solanaAssetsTheBlockchain-${publicKey}.json`, JSON.stringify(nftData));

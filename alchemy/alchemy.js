// Alchemy getNFT && getNFTMetadata

// https://docs.alchemy.com/alchemy/enhanced-apis/nft-api
// https://github.com/alchemyplatform/Build-Your-NFT-Explorer/blob/main/README.md
// https://www.youtube.com/watch?v=YehktV6LSqw

// https://dashboard.alchemyapi.io/apps
// https://docs.alchemy.com/alchemy/guides/nft-api-quickstart-guide#javascript-fetch
// https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnftmetadata
// https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnftmetadata

import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';

// Setup request options:
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

var config = {
    method: 'get',
}

const apiKey = process.env.ALCHEMY_KEY;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`;
// Replace with the wallet address you want to query:
const ownerAddr = "0x0f0eae91990140c560d4156db4f00c854dc8f09e";
const fetchURL = `${baseURL}?owner=${ownerAddr}`;


// Get all NFTs for a user
const recursiveGet = async(url, data) => {
    console.log(data.length, url);
    config.url = url;
    await axios(config).then(response => {
        data.concat(response.data.ownedNfts);
        if (response.data.pageKey) {
            return recursiveGet(`${fetchURL}?pageKey=${response.data.pageKey}`, data);
        }
    }).catch((err) => {
        fs.writeFileSync('./nftDatasets/err.json', JSON.stringify(err))
    });
    return data;
}

const nftCollection = fs.readFileSync('./nftDatasets/openSeaAssets-0x0f0eae91990140c560d4156db4f00c854dc8f09e.json');
let parsed = JSON.parse(nftCollection);

let newArray = [];

for (let i = 0; i < parsed.length; i++) {
    let asset = parsed[i];
    console.log(asset)
    newArray.push({
        contractAddress: asset.tokenAddress,
        tokenId: asset.tokenId,
        tokenType: asset.assetContract && asset.assetContract.schemaName && asset.assetContract.schemaName.toLowerCase()
    })
}

const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;



// const result = await recursiveGet(fetchURL, []);

fs.writeFileSync(`./nftDatasets/alchemy-${ownerAddress}.json`, JSON.stringify(newArray));

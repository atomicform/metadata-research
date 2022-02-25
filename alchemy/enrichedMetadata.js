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

const apiKey = process.env.ALCHEMY_KEY;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;

// import opensea data
const osRaw = fs.readFileSync('./nftDatasets/openSeaAssets-0x0f0eae91990140c560d4156db4f00c854dc8f09e.json');
const osParsed = JSON.parse(osRaw);


// Create Enriched Dataset
for (let i = 0; i < osParsed.length; i++) {
    const asset = osParsed[i];
    const contractAddress = asset.tokenAddress;
    const tokenId = asset.tokenId;
    const tokenType = asset.assetContract.schemaName.toLowerCase();

    await axios({
        method: 'get',
        url: `${baseURL}?contractAddress=${contractAddress}&tokenId=${tokenId}&tokenType=${tokenType}`,
    }).then(async (response) => {
        asset.alchemy = response.data;
        const tokenURI = response.data.tokenUri.gateway;
        // Request the metadata if tokenURI is address, else set the on-chain value
        if (tokenURI.includes('http')) {
            asset.tokenURIData = await axios({ method: 'get', url: tokenURI }).then(response => response);
        } else {
            asset.tokenURIData = tokenURI;
        }
        // Specify the storage type
        if (tokenURI.includes('ipfs.io')) {
            asset.storageType= 'IPFS';
        } else if (tokenURI.includes('amazonaws') || tokenURI.includes('cloudfront.net')) {
            asset.storageType = 'AWS'
        } else if (tokenURI.includes('cloudfunctions.net')) {
            asset.storageType = "GCP"
        }  else if (tokenURI.includes('blob.core.windows.net')) {
            asset.storageType = "Azure"
        }else if (tokenURI.includes('arweave') || tokenURI.includes('ar://')) {
            asset.storageType = 'ARWEAVE'
        } else if (tokenURI.includes('data:application/')) {
            asset.storageType = 'onChain app'
        }  else if (tokenURI.includes('data:text/plain')) {
            asset.storageType = 'base encoded'
        } else if (tokenURI.includes('token.artblocks.io') || tokenURI.includes('api.artblocks.io')) {
            asset.storageType = 'Art Blocks'
        } else if (tokenURI.includes('niftygatway.com')) {
            asset.storageType = 'Nifty Gateway'
        } else if (tokenURI.includes('opensea.io')) {
            asset.storageType = 'Open Sea'
        } else if (tokenURI.includes('http')) {
            const tokenURL = new URL(tokenURI);
            asset.storageType = tokenURL.hostname
        } else {
            return 'unmatched'
        }   
    }).catch(error => console.log(error));
    console.log('hi', i)
}


fs.writeFileSync('./nftDatasets/enrichedMetadata.json', JSON.stringify(osParsed));

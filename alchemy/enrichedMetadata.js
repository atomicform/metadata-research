// https://dashboard.alchemyapi.io/apps
// https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnftmetadata
// Get NFT metadata and enrich it
// This uses the Opensea data but could be easily refactored to pull 100% from Alchemy

import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import {fileTypeFromBuffer} from 'file-type';

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
        console.log('hiii', tokenURI)
        // Handle base encoded tokenURI
        if (tokenURI.includes('/json;utf8,')) {
            let parsedTokenURI = response.data.tokenUri.raw.split('/json;utf8,').pop()
            asset.tokenURIData = parsedTokenURI;
        } else if (tokenURI.includes('http')) {
            asset.tokenURIData = await axios({ method: 'get', url: tokenURI }).then(response => {
                // console.log(response.data)
                return response.data
            });
        } else {
            asset.tokenURIData = tokenURI;
        }
        // Specify the storage type
        if (tokenURI.includes('ipfs')) {
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

        asset.mimeType = await axios.get(asset.alchemy.media[0].gateway, { responseType: 'arraybuffer' }).then(async (response) => {
            const buffer = Buffer.from(response.data, 'binary');
            const type = await fileTypeFromBuffer(buffer);
            return type
        });
    }).catch(error => console.log(error));
    console.log('hi', i)
}


fs.writeFileSync('./nftDatasets/alchemy-enriched.json',JSON.stringify(osParsed));

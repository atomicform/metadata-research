// https://dashboard.alchemyapi.io/apps
// https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnftmetadata
// This script is an example for how to retrieve NFTs for a given owner on the ethereum blockchain

import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';

// Variables for constructing base fetch URL
const apiKey = process.env.ALCHEMY_KEY;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`;
const ownerAddress = "0x0f0eae91990140c560d4156db4f00c854dc8f09e";
const fetchURL = `${baseURL}?owner=${ownerAddress}`;


// Recursive Function to get all NFTs for a user
const recursiveGet = async(url, data) => {
    await axios.get(url).then(response => {
        const { ownedNfts, pageKey } = response.data;
        // concatenate new returned NFTs to the passed data prop
        data = data.concat(ownedNfts);
        console.log("data length", data.length);
        // If pageKey exists on request, make another request
        if (pageKey) {
            return recursiveGet(`${fetchURL}&pageKey=${pageKey}`, data);
        }
    }).catch((err) => {
        fs.writeFileSync('./nftDatasets/alchemy-err.json', JSON.stringify(err))
    });
    return data;
}

// Invoke recursive function
const nftCollection = await recursiveGet(fetchURL, []);

// Write to file
fs.writeFileSync(`./nftDatasets/alchemy-${ownerAddress}.json`, JSON.stringify(nftCollection));

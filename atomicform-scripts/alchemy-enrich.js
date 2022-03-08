// This script pulls from a dataset where there is only one NFT per collection
// This parses the tokenURI
// Some improvement might need to be made for on-chain parsing

import 'dotenv/config';
import fs from 'fs';
import axios from 'axios';

const apiKey = process.env.ALCHEMY_KEY;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;

const nftCollection = fs.readFileSync('./nftDatasets/noDupes.json');

const enrichedMetadata = [];

let parsedCollection = JSON.parse(nftCollection);
let tokenAddresses = Object.keys(parsedCollection);

for (let i = 0; i < tokenAddresses.length; i++) {
    const tokenAddress = tokenAddresses[i];
    const { tokenId, tokenType } = parsedCollection[tokenAddress];

    await axios({
        method: 'get',
        url:  `${baseURL}?contractAddress=${tokenAddress}&tokenId=${tokenId}&tokenType=${tokenType}`,
    }).then(async (response) => {
        const { data } = response;
        console.log(data)
        const tokenURIGateway = data.tokenUri.gateway;
        // Handle encoded token URIs to get tokenURI in json
        // TODO: figure out NFTs where this will fail
        if (tokenURIGateway.includes('data:application/json;utf8')) {
            let trimmedStringifiedTokenURI = tokenUriGateway.split('/json;utf8,').pop();
            let parsedTokenURI = JSON.parse(trimmedStringifiedTokenURI);
            data.parsedTokenURI = parsedTokenURI;
        } else if (tokenURIGateway.includes('http')) {
            // request contents of tokenURI gateway value
            data.parsedTokenURI = await axios({ method: 'get', url: tokenURIGateway})
                .then(response => response.data)
                .catch(error => console.log(tokenAddress, 'inner', error))
        } else {
            data.parsedTokenURI = ''
        }
        // push nft metadata into array
        enrichedMetadata.push(data)
    })
    .catch(error => {
        console.log(tokenAddress, 'outer', error)
    });
}

console.log(enrichedMetadata.length)

fs.writeFileSync('./alchemy-en.json', JSON.stringify(enrichedMetadata))
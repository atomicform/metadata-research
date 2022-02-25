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

const nftCollection = fs.readFileSync('./nftDatasets/alchemy.json');
let parsedNFTCollection = JSON.parse(nftCollection);

let nftMetadataCollection = [];


function delay() {
    setTimeout(() => {}, 1000);
}

// Get Alchemy Metadata
for (let i = 0; i < parsedNFTCollection.length; i++) {
    const {contractAddress, tokenId, tokenType} = parsedNFTCollection[i];
    await axios({
        method: 'get',
        url: `${baseURL}?contractAddress=${contractAddress}&tokenId=${tokenId}&tokenType=${tokenType}`,
    }).then(response => nftMetadataCollection.push(response.data))
    .catch(error => console.log(error));
    delay();
    console.log('num', i)
}

fs.writeFileSync('./nftDatasets/alchemyNFTMetadata.json', JSON.stringify(nftMetadataCollection));

// https://github.com/ourzora/nft-metadata
import { Agent } from '@zoralabs/nft-metadata';
import fs from 'fs';

// Read in already collected OpenSea data]
const dataset = fs.readFileSync('./nftDatasets/openSeaAssets-0x0f0eae91990140c560d4156db4f00c854dc8f09e.json');
const parsed = JSON.parse(dataset);

let returnedData = [];

const parser = new Agent({
    // Use ethers.js Networkish here: numbers (1/4) or strings (homestead/rinkeby) work here
    network: 'homestead',
    // Timeout: defaults to 40 seconds, recommended timeout is 60 seconds (in milliseconds)
    timeout: 60 * 1000,
  });

  for (let i = 0; i < parsed.length; i++) {
    let asset = parsed[i];
    parser.fetchMetadata(asset.tokenAddress, asset.tokenId).then((data) => {
        returnedData.push(data)
    })
  }

  fs.writeFileSync('./nftDatasets/zora.json',returnedData)
  console.log(returnedData);
  // Can use typical promises or async/await to get the return value of fetchMetadata
// parser.fetchMetadata('0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6', '23').then((data) => {
//     console.log(data);
// });
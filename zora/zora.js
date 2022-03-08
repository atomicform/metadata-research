// This script shows a basic way to iterate through an already collected group of NFTs
// and enrich them with the Zora parser
// https://github.com/ourzora/nft-metadata
import { Agent } from '@zoralabs/nft-metadata';
import fs from 'fs';

// Read in already collected OpenSea data]
const dataset = fs.readFileSync('./nftDatasets/openSeaAssets-0x0f0eae91990140c560d4156db4f00c854dc8f09e.json');
const parsed = JSON.parse(dataset);

let returnedData = [];

const parser = new Agent({
    // Use ethers.js Network here: numbers (1/4) or strings (homestead/rinkeby) work here
    network: 'homestead',
    // Timeout: defaults to 40 seconds, recommended timeout is 60 seconds (in milliseconds)
    timeout: 60 * 1000,
  });

  for (let i = 0; i < parsed.length; i++) {
    let asset = parsed[i];
    try {
      await parser.fetchMetadata(asset.tokenAddress, asset.tokenId).then((data) => {
        const newMetadata = {};
        newMetadata.length = data.metadata.length;
        
        returnedData.push(data)
      });
    } catch (e) {
      console.log('error', e)
    }
    console.log('asset #', i)
  }

fs.writeFileSync('./nftDatasets/zora.json', JSON.stringify(returnedData))

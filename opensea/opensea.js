import 'dotenv/config';
import Web3 from 'web3';
import { OpenSeaPort, Network } from 'opensea-js';
import fs from "fs";

// Set up default provider, can only be used for read ops on OpenSea API
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')

// Instantiate OpenSea "seaport" yarrr matey
const seaport = new OpenSeaPort(provider, {
    networkName: Network.Main,
    apiKey: process.env.OPENSEA_KEY
  });

// https://github.com/atomicform/atomicform-api
// https://github.com/ProjectOpenSea/opensea-js

// Function to recursively retrieve all assets for a given collector from OpenSea
const recursiveGet = async function (results, offset) {
  requestOptions.offset = offset;
  const newData = await seaport.api.getAssets(requestOptions);
  results = results.concat(newData.assets);

  return (newData.assets.length > 0) ? await recursiveGet(results, offset += limit) : results
}

// Vincent Van Dough's public address
const ownerAddress = '0x0f0eae91990140c560d4156db4f00c854dc8f09e';

// Instantiate offset and limit values for handling API pagination
// Max Assets for a request is 50 (limit)
let offset = 0;
const limit = 50;

// Request Options
const requestOptions = {
  owner: ownerAddress,
  order_direction: 'desc',
  limit: limit,
  offset: offset
};

// Get all NFT's from OpenSea in the specified owner's collection
const results = await recursiveGet([], offset);

// Write NFT Collection to JSON
fs.writeFileSync(`./nftDatasets/openSeaAssets-${ownerAddress}.json`, JSON.stringify(results));

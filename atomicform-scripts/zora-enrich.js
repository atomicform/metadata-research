// This uses the Zora Metadata parser to enhance our own analysis/codebase
// This parses the tokenURI and metadata

// https://github.com/ourzora/nft-metadata
import { Agent } from '@zoralabs/nft-metadata';
import axios from 'axios';
import fs from 'fs';

// Read in already collected OpenSea data]
const dataset = fs.readFileSync('./nftDatasets/noDupes.json');
const parsed = JSON.parse(dataset);

let returnedData = [];
let tokenAddresses = Object.keys(parsed);

const parser = new Agent({
    // Use ethers.js Network here: numbers (1/4) or strings (homestead/rinkeby) work here
    network: 'homestead',
    // Timeout: defaults to 40 seconds, recommended timeout is 60 seconds (in milliseconds)
    timeout: 60 * 1000,
  });

  for (let i = 0; i < tokenAddresses.length; i++) {
    const tokenAddress = tokenAddresses[i];
    const { tokenId } = parsed[tokenAddress];

    try {
      await parser.fetchMetadata(tokenAddress, tokenId).then(async (data) => {
        // fetch the full metadata
        const { tokenURL } = data;
        // handle embedded json
        if (tokenURL.includes('data:application/json;utf8,')) {
            let parsedTokenURL = tokenURL.split('data:application/json;utf8,').pop()
            data.parsedTokenURL = JSON.parse(parsedTokenURL);
        } else if (tokenURL.includes('data:application/json;base64,')) {
            let encodedData = tokenURL.split('data:application/json;base64,').pop()
            let buff = Buffer.from(encodedData, 'base64');
            let decodedString = buff.toString('utf8');
            data.parsedTokenURL = decodedString;
        } else if (tokenURL.includes('ar://')) {
            let urlSubString = tokenUrl.split('ar://').pop();
            data.parsedTokenURL = await axios({ method: 'get', url: `https://arweave.net/${urlSubString}`}).then(response => response.data).catch(err => console.log(err));
        } else if (tokenURL.includes('http')) {
            data.parsedTokenURL = await axios({ method: 'get', url: tokenURL}).then(response => response.data).catch(err => console.log(err));
        } else {
            data.parsedTokenURL = tokenURL;
        }
        
        returnedData.push(data)
      });
    } catch (e) {
      console.log('error', e)
    }
    console.log('asset #', i)
  }

  // use contentURL to search for key by value to identify what is the primary key

fs.writeFileSync('./z.json', JSON.stringify(returnedData))

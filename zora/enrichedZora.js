// This script pulls NFT data through the Zora parser and adds additional analysis
// This script collects all of the URL fields necessary for deeper analysis
// https://github.com/ourzora/nft-metadata
import { Agent } from '@zoralabs/nft-metadata';
import fs from 'fs';

// Read in already collected OpenSea data]
const dataset = fs.readFileSync('./nftDatasets/noDupes.json');
const parsed = JSON.parse(dataset);
const tokenAddresses = Object.keys(parsed);

let returnedData = [];

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
      await parser.fetchMetadata(tokenAddress, tokenId).then((data) => {
        const newMetadata = {};
        newMetadata.metadataProps = Object.keys(data.metadata);
        newMetadata.length = Object.keys(data.metadata).length;
        newMetadata.urlFields = {};
        newMetadata.urlFieldsArray = [];
        for (let i = 0; i < newMetadata.length; i++) {
          const metadataKey = newMetadata.metadataProps[i];
          const metadataValue = data.metadata[metadataKey];
          if (typeof(metadataValue) == "string") {
            // Check if its a url and ensure it's not a known non-media prop
            if ((metadataValue.startsWith("http")
            || metadataValue.startsWith('ipfs:'))
            && (['external_url', 'website', 'projectLogo', 'license', 'license_url'].indexOf(metadataKey) < 0 )) {
              // add value to url fields array if it is a potential asset url
              newMetadata.urlFieldsArray.push(metadataKey)
              newMetadata.urlFields[metadataKey] = metadataValue;
              // If the metadata value matches the contentURL, set it as the contentKey
              if (metadataValue == data.contentURL) {
                newMetadata.contentKey = metadataKey;
                // handle situations with ipfs url structure
              } else if (metadataValue.startsWith('ipfs') && data.contentURL.includes('ipfs.io')) {
                let ipfsString = metadataValue.split('ipfs://').pop()
                let contentURLSubstring = data.contentURL.split('ipfs.io/').pop()
                if (ipfsString == contentURLSubstring) {
                  newMetadata.contentKey = metadataKey;
                }
              }
            }
          }
        }

        if (data.contentURL) {
          const { contentURL } = data;

           // Specify the media storage type
          if (contentURL.includes('ipfs')) {
            newMetadata.mediaStorageType= 'IPFS';
          } else if (contentURL.includes('amazonaws') || contentURL.includes('cloudfront.net')) {
              newMetadata.mediaStorageType = 'AWS'
          } else if (contentURL.includes('cloudfunctions.net')) {
              newMetadata.mediaStorageType = "GCP"
          } else if (contentURL.includes('wp-storage')) {
            newMetadata.mediaStorageType = "Wordpress"
          } else if (contentURL.includes('blob.core.windows.net') || contentURL.includes('azure')) {
              newMetadata.mediaStorageType = "Azure"
          }else if (contentURL.includes('arweave') || contentURL.includes('ar://')) {
              newMetadata.mediaStorageType = 'ARWEAVE'
          } else if (contentURL.includes('data:')) {
              newMetadata.mediaStorageType = 'On Chain'
          } else if (contentURL.includes('token.artblocks.io') || contentURL.includes('api.artblocks.io')) {
              newMetadata.mediaStorageType = 'Art Blocks'
          } else if (contentURL.includes('niftygatway.com')) {
              newMetadata.mediaStorageType = 'Nifty Gateway'
          } else if (contentURL.includes('opensea.io')) {
              newMetadata.mediaStorageType = 'Open Sea'
          } else if (contentURL.includes('http')) {
              const newUrlContentURL = new URL(contentURL);
              newMetadata.mediaStorageType = newUrlContentURL.hostname
          } else {
              newMetadata.mediaStorageType = 'unmatched'
          }
        }

        if (data.tokenURL) {
          const { tokenURL } = data;
            // Specify the media storage type
            if (tokenURL.includes('ipfs')) {
              newMetadata.tokenURLStorageType= 'IPFS';
            } else if (tokenURL.includes('amazonaws') || tokenURL.includes('cloudfront.net')) {
                newMetadata.tokenURLStorageType = 'AWS'
            } else if (tokenURL.includes('cloudfunctions.net')) {
                newMetadata.tokenURLStorageType = "GCP"
            } else if (tokenURL.includes('wp-storage')) {
              newMetadata.mediaStorageType = "Wordpress"
            } else if (tokenURL.includes('blob.core.windows.net') || tokenURL.includes('azure')) {
                newMetadata.tokenURLStorageType = "Azure"
            }else if (tokenURL.includes('arweave') || tokenURL.includes('ar://')) {
                newMetadata.tokenURLStorageType = 'ARWEAVE'
            } else if (tokenURL.includes('data:')) {
                newMetadata.tokenURLStorageType = 'On Chain'
            } else if (tokenURL.includes('token.artblocks.io') || tokenURL.includes('api.artblocks.io')) {
                newMetadata.tokenURLStorageType = 'Art Blocks'
            } else if (tokenURL.includes('niftygatway.com')) {
                newMetadata.tokenURLStorageType = 'Nifty Gateway'
            } else if (tokenURL.includes('opensea.io')) {
                newMetadata.tokenURLStorageType = 'Open Sea'
            } else if (tokenURL.includes('http')) {
                const newUrlTokenURL = new URL(tokenURL);
                newMetadata.tokenURLStorageType = newUrlTokenURL.hostname
            } else {
                newMetadata.tokenURLStorageType = 'unmatched'
            }
        }
        if (data.metadata.details) data.metadata.detailsCount = data.metadata.details.length;
        if (data.metadata.attributes) {
          data.metadata.attributeCount = data.metadata.attributes.length;
          delete data.metadata.attributes;
          data.metadata = JSON.stringify(data.metadata);
        }

        newMetadata.urlFieldsArray.sort();
        data.atomicFormFields = newMetadata;
        returnedData.push(data)
      });
    } catch (e) {
      console.log('error', e)
    }
    console.log('asset #', i)
  }

fs.writeFileSync('./nftDatasets/zozo.json', JSON.stringify(returnedData))

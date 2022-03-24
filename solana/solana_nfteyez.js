import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import fs from "fs";
import fetch from 'node-fetch';

try {
  const address = "2fsy96RzSDJaBXKxep8iKYqLFy4BS7pXsD1Kyr7BfZXE";
  // or use Solana Domain
  //const address = "NftEyez.sol";

  const publicAddress = await resolveToWalletAddress({
    text: address
  });

  const nftArray = await getParsedNftAccountsByOwner({
    publicAddress,
  });console.log(nftArray);

  let nftData = nftArray;

  for (let index = 0; index < nftData.length; index++) {
    const metadataCall = await fetch(nftData[index].data.uri);
    const metadataCallData = await metadataCall.json();
    nftData[index].metaResult = metadataCallData;
  }

  fs.writeFileSync(`./nftDatasets/solanaAssetsNfteyez-${address}.json`, JSON.stringify(nftData));
} catch (error) {
  console.log("Error thrown, while fetching NFTs", error.message);
}

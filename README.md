# NFT Metadata Exploration

This repo contains code that is being used in a research project to better understand NFT Metadata Diversity. It includes scripts for retrieving NFT metadata from various providers and APIs to get a better understanding of the current state of NFT metadata.

Today, there's variability in how and where NFT metadata is structured and stored. This poses a challenge in creating solutions for NFT aggregation, display and exploration.

By better understanding the current state, we can better support the NFT ecosystem as it is and hopefully encourage standardization in the future.

## Providers
There is a folder for each NFT metadata provider that has been tested so far
- Alchemy
- OpenSea
- Zora

OpenSea and Alchemy require API keys to be placed in a .env file with the following syntax

```
OPENSEA_KEY=""
ALCHEMY_KEY=""
```

This data isn't being persisted into a database until we have a better understanding of the data structure we'd like to persist, these scripts are currently writing the API results to the nftDatasets directory.

## Generating CSV
The metadata analysis was done primarily in spreadsheets. To that end, I had to convert the JSON payloads the API's were returning and converting them to CSV.

To do this, I used [json2csv](https://github.com/zemirco/json2csv)'s CLI tool. To do this, you'll need to install it globally.
`npm install -g json2csv`

Then I executed the following from the command line
`json2csv -i <path to input json file> -o <path to output csv file> --flatten-objects --include-empty-rows`

Note that this will flatten all objects in the input JSON file and include empty rows, this can result in a very wide table.

If you want to specify which fields to include in the output CSV, use the `--fields` option

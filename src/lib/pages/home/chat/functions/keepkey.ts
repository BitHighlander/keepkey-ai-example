// src/walletFunctions.ts

export const COIN_MAP_KEEPKEY_LONG = {
  BTC: "Bitcoin",
  GAIA: "Cosmos",
  ATOM: "Cosmos",
  ARB: "Arbitrum",
  OSMO: "Osmosis",
  TEST: "Testnet",
  BCH: "BitcoinCash",
  LTC: "Litecoin",
  DASH: "Dash",
  DGB: "DigiByte",
  DOGE: "Dogecoin",
  RUNE: "Thorchain",
  THOR: "Thorchain",
  ETH: "Ethereum",
  ADA: "Cardano",
  MATIC: "Polygon",
  BSC: "Binance",
  BNB: "Binance",
  AVAX: "Avalanche",
  EOS: "Eos",
  FIO: "Fio",
  ZEC: "Zcash",
};

export const EXAMPLE_WALLET = (sdk: any) => ({
  getCoins: async () => {
    return Object.keys(COIN_MAP_KEEPKEY_LONG);
  },

  getBitcoinAddress: async (params: { network: any }) => {
    const addressInfo = {
      addressNList: [0x80000000 + 49, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
      coin: "Bitcoin",
      scriptType: "p2sh-p2wpkh",
      showDisplay: false,
    };
    const response = await sdk.address.utxoGetAddress({
      address_n: addressInfo.addressNList,
      script_type: addressInfo.scriptType,
      coin: addressInfo.coin,
    });
    return response;
  },

  getDogecoinAddress: async (params: { network: any }) => {
    const addressInfo = {
      addressNList: [2147483732, 2147483648, 2147483648, 0, 0],
      coin: "Dogecoin",
      scriptType: "p2sh",
      showDisplay: false,
    };
    const response = await sdk.address.utxoGetAddress({
      address_n: addressInfo.addressNList,
      script_type: addressInfo.scriptType,
      coin: addressInfo.coin,
    });
    return response;
  },

  getMayachainAddress: async () => {
    const addressInfo = {
      addressNList: [2147483692, 2147484579, 2147483648, 0, 0],
    };
    const timeStart = new Date().getTime();
    const response = await sdk.address.mayachainGetAddress(addressInfo);
    const timeEnd = new Date().getTime();
    console.log("duration: ", (timeEnd - timeStart) / 1000);
    return response;
  },

  getEthereumAddress: async () => {
    const addressInfo = {
      addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
      coin: "Ethereum",
      scriptType: "ethereum",
      showDisplay: false,
    };
    const timeStart = new Date().getTime();
    const response = await sdk.address.ethereumGetAddress({
      address_n: addressInfo.addressNList,
    });
    const timeEnd = new Date().getTime();
    console.log("duration: ", (timeEnd - timeStart) / 1000);
    return response;
  },

  getDashAddress: async () => {
    const addressInfo = {
      addressNList: [2147483732, 2147483653, 2147483648, 0, 0],
      coin: "Dash",
      scriptType: "p2sh",
      showDisplay: false,
    };
    const timeStart = new Date().getTime();
    const response = await sdk.address.utxoGetAddress({
      address_n: addressInfo.addressNList,
      script_type: addressInfo.scriptType,
      coin: addressInfo.coin,
    });
    const timeEnd = new Date().getTime();
    console.log("duration: ", (timeEnd - timeStart) / 1000);
    return response;
  },

  getCosmosAddress: async () => {
    const addressInfo = {
      addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
      coin: "Cosmos",
      scriptType: "cosmos",
      showDisplay: false,
    };
    const timeStart = new Date().getTime();
    const response = await sdk.address.cosmosGetAddress({
      address_n: addressInfo.addressNList,
    });
    const timeEnd = new Date().getTime();
    console.log("duration: ", (timeEnd - timeStart) / 1000);
    return response;
  },

  getOsmosisAddress: async () => {
    const addressInfo = {
      addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
      coin: "Osmosis",
      scriptType: "cosmos",
      showDisplay: false,
    };
    const timeStart = new Date().getTime();
    const response = await sdk.address.osmosisGetAddress({
      address_n: addressInfo.addressNList,
    });
    const timeEnd = new Date().getTime();
    console.log("duration: ", (timeEnd - timeStart) / 1000);
    return response;
  },
});

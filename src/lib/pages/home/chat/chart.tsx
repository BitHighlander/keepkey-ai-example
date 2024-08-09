/*
   Pioneer SDK (react) Chart

   Concepts:

   * paths
   * pubkeys
   * assets

    State: assetContext
    State: outboundAssetContext

    objects:
    Balance: {
        balance: "0.000205234405364000",
        caip: "eip155:42161/slip44:60",
        chain: "ARB",
        context: "keepkey:device.wallet",
        contextType: "keepkey",
        id: 1,
        identifier: "ARB.ETH",
        networkId: "eip155:42161",
        priceUsd: 3247.1,
        pubkey: undefined,
        ref: "eip155:42161/slip44:60",
        symbol: "ETH",
        ticker: "ETH",
        type: "Native",
        valueUsd: 0.6664166376574444
    }

    Path = {
        "note": "Bitcoin account 0",
        "networks": [
            "bip122:000000000019d6689c085ae165831e93"
        ],
        "script_type": "p2pkh",
        "available_scripts_types": [
            "p2pkh",
            "p2sh",
            "p2wpkh",
            "p2sh-p2wpkh"
        ],
        "type": "xpub",
        "addressNList": [
            2147483692,
            2147483648,
            2147483648
        ],
        "addressNListMaster": [
            2147483692,
            2147483648,
            2147483648,
            0,
            0
        ],
        "curve": "secp256k1",
        "showDisplay": false
    }

    let app = {
        blockchains: [
            "eip155:42161",
            "eip155:43114",
            "eip155:8453",
            "eip155:56",
            "bip122:000000000019d6689c085ae165831e93",
            "bip122:000000000000000000651ef99cb9fcbe",
            "cosmos:cosmoshub-4",
            "cosmos:osmosis-1",
            "ripple:4109c6f2045fc7eff4cde8f9905d19c2",
            "bip122:00000000001a91e3dace36e2be3bf030",
            "bip122:000007d91d1254d60e2dd1ae58038307",
            "cosmos:mayachain-mainnet-v1",
            "eip155:1",
            "bip122:12a765e31ffd4059bada1e25190f6e98",
            "eip155:10",
            "eip155:137",
            "cosmos:thorchain-mainnet-v1"
        ],
        balances: [
            Balance*
        ],
        charts: [
            'covalent', 'zapper'
        ],
        paths: [
            Path*
        ],
        swapkit: {
            createLiquidity: async ({ runeAssetValue: c, assetValue: s }) => {…},
            deposit: async ({ assetValue: c, recipient: s, router: a, ...i }) => {…},
            disconnectChain: (c) => {…},
            estimateMaxSendableAmount: async ({ chain: c, params: s }) => {…},
            extend: ({ wallets: c, config: s, apis: a = {}, rpcUrls: i = {} }) => {…},
            getAddress: async (c, s) => {…},
            getAddressAsync: async (c, s) => {…},
            getBalance: async (c, s, a) => {…},
            getBalances: async (c, s) => {…},
            getExplorerAddressUrl: (c, s) => PQ({ chain: c, address: s }),
            getExplorerTxUrl: (c, s) => NQ({ chain: c, txHash: s }),
            getWallet: (c) => this.connectedWallets[c],
            isAssetValueApproved: (c, s) => {…},
            loan: ({ assetValue: c, memo: s, minAmount: a, type: i }) => {…},
            nodeAction: ({ type: c, assetValue: s, address: a }) => {…},
            performTx: async (c) => {…},
            registerThorname: ({ assetValue: c, ...s }) => {…},
            savings: async ({ assetValue: c, memo: s, percent: a, type: i }) => {…},
            stagenet: false,
            swap: async ({ streamSwap: c, recipient: s, route: a, feeOptionKey: i }) => {…},
            syncWalletByChain: async (c) => {…},
            transfer: async (c) => {…},
            validateAddress: ({ address: c, chain: s }) => {…},
            withdraw: async ({ memo: c, assetValue: s, percent: a, from: i, to: t }) => {…}
        }
    }


    Generative UI:

    basic:
        View Server: username, QueryKey Server	https://pioneers.dev/spec/swagger.json
        Username	user:a6ca0f66
        QueryKey	key:b7c22c33-3083-41ab-9b6d-e0342c095d00
        lastConnected	keepkey:device.wallet
        Asset Context	no wallets paired!
        Address for context	no wallets paired!

    Asset
    Asset page, (required assetContext) to be set

    transfer:
    Transfer page, (required assetContext) to be set

    Classic:
        view all balances in a table

    Portfolio show the pie chart of all balances

    swap:
        Trade assets from one asset to the other


 */

//@ts-ignore
// import { ChainToNetworkId, shortListSymbolToCaip } from '@pioneer-platform/pioneer-caip';
// // import { COIN_MAP_LONG } from '@pioneer-platform/pioneer-coins';

const chartId = "keepkey-sdk:0.0.1:intro";

//TODO get latest chart from server
//compare to local chart
//if new chart, update server with ID
//show chartIds available
//if local is known AND scores lower than server, update local chart (optional)

const UI_COMPONENTS = [
  {
    name: "Asset",
    description:
      "Displays the asset page, displays balances price and actions buy/sell/transfer",
  },
  {
    name: "Transfer",
    description:
      "Displays the transfer page, allows user to send assets to another address",
  },
];

export const PROMPTS_SYSTEM: any = [
  {
    role: "system",
    content: [
      `You are an assistant that can call functions to get information.`,
      `- If you need to get the networks address, use the getAddress function.`,
      `- If you need to get the networks balance, use the getBalance function.`,
      "Format all outputs in readable markdown format",
    ].join("\n"),
  },
];

export const TOOLS: any = [
  {
    name: "getAddress",
    description:
      "Retrieve the address for a specified network. The function takes a networkId, which corresponds to the coin symbol provided by the user. for instance bitcoin (BTC) network is bip122:000000000019d6689c085ae165831e93",
    parameters: {
      type: "object",
      properties: {
        network: {
          type: "string",
          description:
            "the networkId is in format (example) bip122:000000000019d6689c085ae165831e93 is the network for bitcoin (BTC)",
        },
      },
      required: ["network"],
    },
  },
];

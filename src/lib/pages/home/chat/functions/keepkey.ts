// src/walletFunctions.ts

export const EXAMPLE_WALLET = (app: any) => ({
  getAddress: async (params: { network: any }) => {
    const pubkeys = app.pubkeys.filter((e: any) =>
      e.networks.includes(params.network)
    );
    if (pubkeys.length > 0) {
      return "0xfakeaddressbro";
    } else {
      throw Error("No pubkey found for " + params.network);
    }
  },
});

// src/walletFunctions.ts

export const EXAMPLE_WALLET = (app: any) => ({
  getAddress: async (params: { network: any }) => {
    if (true) {
      return "0xfakeaddressbro";
    } else {
      throw Error("No pubkey found for " + params.network);
    }
  },
});

import { useState, useCallback } from "react";
import { StellarWalletsKit, WalletNetwork, FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit";

const kit = new StellarWalletsKit({
  network: import.meta.env.VITE_STELLAR_NETWORK === "mainnet"
    ? WalletNetwork.PUBLIC
    : WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
});

export function useWallet() {
  const [address, setAddress] = useState(null);

  const connect = useCallback(async () => {
    await kit.openModal({
      onWalletSelected: async (option) => {
        kit.setWallet(option.id);
        const { address: addr } = await kit.getAddress();
        setAddress(addr);
      },
    });
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  return { address, connect, disconnect, kit };
}

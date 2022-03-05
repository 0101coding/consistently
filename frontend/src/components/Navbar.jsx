import React from "react";
import { useWallet } from "../context/WalletContext";
import { getTruncatedAddress } from "../helpers";
import { getSignerAddress } from "../provider";
import Button from "./Button";
import styles from "./styles/Header.module.css";

export default function Navbar() {
  const { setWalletAddress, walletAddress } = useWallet();
  const handleConnect = async () => {
    const ethereum = window.ethereum;
    if (ethereum) {
      await ethereum.request({ method: "eth_requestAccounts" });
      const address = await getSignerAddress();
      if (address) {
        setWalletAddress(address);
      }
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>DaapBoi</div>
      <div className="nav-links">
        <span>{}</span>
        {walletAddress ? (
          <span>{getTruncatedAddress(walletAddress)}</span>
        ) : (
          <Button onClick={handleConnect}>Connect</Button>
        )}
      </div>
    </nav>
  );
}

import React from "react";
import { useWallet } from "../context/WalletContext";
import ConnectButton from "./ConnectButton";
import styles from "./styles/Header.module.css";

export default function Header() {
  const { wallet } = useWallet();

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>DaapBoi</div>
      <div className="nav-links">
        <span>{}</span>
        {wallet ? <span>0xbl...</span> : <ConnectButton />}
      </div>
    </nav>
  );
}

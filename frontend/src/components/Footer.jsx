import React from "react";
import styles from "./styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      Prepared by{" "}
      <a className={styles.link} href="https://github.com/0101coding" target="_blank" rel="noopener noreferrer">
        Mayowa
      </a>
      <br />
      <br />
      <a
        className={styles.link}
        href="https://github.com/0101coding/chainshot-final-project"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github Repo
      </a>
    </footer>
  );
}

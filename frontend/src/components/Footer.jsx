import React from "react";
import styles from "./styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      Prepared by{" "}
      <a className={styles.link} href="https://github.com/chiranz" target="_blank" rel="noopener noreferrer">
        Chiranjibi
      </a>
      <br />
      <br />
      <a
        className={styles.link}
        href="https://github.com/chiranz/simple-react-daap-boilerplate"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github Repo
      </a>
    </footer>
  );
}

import Image from "next/image";
import { useMetaMask } from "../hooks/useMetaMask";
import { SelectCharacter } from "../components/SelectCharacter";
import { Arena } from "../components/Arena";
import twitterLogo from "../assets/twitter-logo.svg";
import { TWITTER_LINK, TWITTER_HANDLE } from "../utils/constants";
import styles from "../styles/home.module.css";
import LoadingIndicator from "../components/LoadingIndicator";

export default function Index() {
  const {
    state: { account, characterNft, characters, isLoading },
    dispatch,
  } = useMetaMask();

  async function connectWallet() {
    console.log("here");
    const { ethereum } = window;

    if (!ethereum) {
      alert("Install MetaMask!");
      return;
    }

    let accounts = [];
    try {
      accounts = await ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      console.log(err);
    }

    dispatch({ type: "setAccount", payload: accounts[0] });
  }

  function renderContent() {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!account) {
      return (
        <div className={styles["connect-wallet-container"]}>
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className={`${styles["cta-button"]} ${styles["connect-wallet-button"]}`}
            onClick={connectWallet}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (account && !characterNft) {
      return <SelectCharacter characters={characters} />;
    } else {
      return <Arena />;
    }
  }

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <div className={styles["header-container"]}>
          <p className={`${styles.header} ${styles["gradient-text"]}`}>
            ⚔️ Metaverse Slayer ⚔️
          </p>
          <p className={styles["sub-text"]}>
            Team up to protect the Metaverse!
          </p>
          {renderContent()}
        </div>
        <div className={styles["footer-container"]}>
          <Image
            alt="Twitter Logo"
            className={styles["twitter-logo"]}
            src={twitterLogo}
            height={50}
            width={50}
          />
          <a
            className={styles["footer-text"]}
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

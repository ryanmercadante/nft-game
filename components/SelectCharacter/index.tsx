import React, { useState } from "react";
import { CharacterData, useMetaMask } from "../../hooks/useMetaMask";
import LoadingIndicator from "../LoadingIndicator";
import styles from "./select-character.module.css";

interface SelectCharacterProps {
  characters: CharacterData[];
}

export const SelectCharacter: React.FC<SelectCharacterProps> = ({
  characters,
}) => {
  const { state } = useMetaMask();

  const [mintingCharacter, setMintingCharacter] = useState(false);

  async function mintCharacterNftAction(characterId: number) {
    if (!state.gameContract) return;

    setMintingCharacter(true);
    console.log("Minting character...");
    try {
      const mintTxn = await state.gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log("Mint transaction:", mintTxn);
    } catch (err) {
      console.warn("MintCharacterAction Error:", err);
    }

    setMintingCharacter(false);
  }

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className={styles["character-item"]} key={character.name}>
        <div className={styles["name-container"]}>
          <p>{character.name}</p>
        </div>
        <img
          src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
          alt={character.name}
        />
        <button
          type="button"
          className={styles["character-mint-button"]}
          onClick={() => mintCharacterNftAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  return (
    <div className={styles["select-character-container"]}>
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className={styles["character-grid"]}>{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div className={styles.loading}>
          <div className={styles.indicator}>
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

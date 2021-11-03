import React from "react";
import { CharacterData, useMetaMask } from "../../hooks/useMetaMask";
import styles from "./select-character.module.css";

interface SelectCharacterProps {
  characters: CharacterData[];
}

export const SelectCharacter: React.FC<SelectCharacterProps> = ({
  characters,
}) => {
  const { state } = useMetaMask();

  async function mintCharacterNftAction(characterId: number) {
    if (!state.gameContract) return;

    console.log("Minting character...");
    try {
      const mintTxn = await state.gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log("Mint transaction:", mintTxn);
    } catch (err) {
      console.warn("MintCharacterAction Error:", err);
    }
  }

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className={styles["character-item"]} key={character.name}>
        <div className={styles["name-container"]}>
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
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
    </div>
  );
};

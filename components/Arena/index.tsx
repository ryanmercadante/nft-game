import React, { useEffect, useState } from "react";
import { CharacterData, useMetaMask } from "../../hooks/useMetaMask";
import { MyEpicGame } from "../../typechain";
import { fetchBoss } from "../../utils/helpers";
import LoadingIndicator from "../LoadingIndicator";
import styles from "./arena.module.css";

enum AttackState {
  ATTACKING = "attacking",
  HIT = "hit",
  EMPTY = "",
}

export const Arena = ({}) => {
  const {
    state: { boss, characterNft, gameContract },
    dispatch,
  } = useMetaMask();

  const [attackState, setAttackState] = useState<AttackState>(
    AttackState.EMPTY
  );
  const [showToast, setShowToast] = useState(false);

  async function runAttackAction() {
    if (!gameContract) return;

    setAttackState(AttackState.ATTACKING);
    console.log("Attacking boss...");
    try {
      const attackTxn = await gameContract.attackBoss();
      await attackTxn.wait();
      console.log("attackTxn:", attackTxn);
      setAttackState(AttackState.HIT);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (err) {
      console.error("Error attacking boss:", err);
      setAttackState(AttackState.EMPTY);
    }
  }

  async function onAttackCompleted(newBossHp: BigInt, newPlayerHp: BigInt) {
    console.log(
      `AttackComplete: Boss Hp: ${newBossHp} Player Hp: ${newPlayerHp}`
    );

    const boss = await fetchBoss(gameContract as MyEpicGame, dispatch);

    dispatch({
      type: "setBoss",
      payload: {
        ...(boss as CharacterData),
        hp: newBossHp as unknown as number,
      } as unknown as CharacterData,
    });
    dispatch({
      type: "setCharacterNft",
      payload: {
        ...(characterNft as CharacterData),
        hp: newPlayerHp as unknown as number,
      } as unknown as CharacterData,
    });
  }

  useEffect(() => {
    if (gameContract) {
      (async () => await fetchBoss(gameContract, dispatch))();
      gameContract.on("AttackCompleted", onAttackCompleted);
    }

    return () => {
      if (gameContract) {
        gameContract.off("AttackCompleted", onAttackCompleted);
      }
    };
  }, [gameContract]);

  return (
    <div className={styles["arena-container"]}>
      {boss && characterNft && (
        <div id={styles.toast} className={showToast ? `${styles.show}` : ""}>
          <div
            id={styles.desc}
          >{`💥 ${boss.name} was hit for ${characterNft.attackDamage}!`}</div>
        </div>
      )}

      {/* Boss */}
      {boss && (
        <div className={styles["boss-container"]}>
          <div className={`${styles["boss-content"]} ${styles[attackState]}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className={styles["image-content"]}>
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className={styles["health-bar"]}>
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className={styles["attack-container"]}>
            <button className={styles["cta-button"]} onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
          {attackState === "attacking" && (
            <div className={styles["loading-indicator"]}>
              <LoadingIndicator />
              <p>Attacking ⚔️</p>
            </div>
          )}
        </div>
      )}

      {/* Character NFT */}
      {characterNft && (
        <div className={styles["players-container"]}>
          <div className={styles["player-container"]}>
            <h2>Your Character</h2>
            <div className={styles.player}>
              <div className={styles["image-content"]}>
                <h2>{characterNft.name}</h2>
                <img
                  src={characterNft.imageURI}
                  alt={`Character ${characterNft.name}`}
                />
                <div className={styles["health-bar"]}>
                  <progress value={characterNft.hp} max={characterNft.maxHp} />
                  <p>{`${characterNft.hp} / ${characterNft.maxHp} HP`}</p>
                </div>
              </div>
              <div className={styles.stats}>
                <h4>{`⚔️ Attack Damage: ${characterNft.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

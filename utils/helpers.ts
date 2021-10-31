import { ethers } from "ethers";
import { CharacterData } from "../hooks/useMetaMask";
import { MyEpicGame, MyEpicGame__factory } from "../typechain";
import { CONTRACT_ADDRESS } from "./constants";

export function transformCharacterData(characterData: any): CharacterData {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
}

export function getGameContract(): MyEpicGame {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return MyEpicGame__factory.connect(CONTRACT_ADDRESS, signer);
}

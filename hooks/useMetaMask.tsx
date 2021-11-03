import { createContext, useContext, useEffect, useReducer } from "react";
import { MyEpicGame } from "../typechain";
import {
  fetchBoss,
  getGameContract,
  transformCharacterData,
} from "../utils/helpers";

export type CharacterData = {
  name: string;
  imageURI: string;
  hp: number;
  maxHp: number;
  attackDamage: number;
};
export type AddressAction = {
  type: "setAccount";
  payload: string;
};
export type CharacterNftAction = {
  type: "setCharacterNft";
  payload: CharacterData;
};
export type CharactersAction = {
  type: "setCharacters";
  payload: CharacterData[];
};
export type GameContractAction = {
  type: "setGameContract";
  payload: MyEpicGame;
};
export type BossAction = {
  type: "setBoss";
  payload: CharacterData;
};
export type Action =
  | AddressAction
  | CharacterNftAction
  | CharactersAction
  | GameContractAction
  | BossAction;
export type Dispatch = (action: Action) => void;
export type State = {
  account: string;
  characterNft: CharacterData | undefined;
  characters: CharacterData[];
  gameContract: MyEpicGame | undefined;
  boss: CharacterData | undefined;
};
export type MetaMaskProviderProps = { children: React.ReactNode };

const MetaMaskContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function accountReducer(state: State, action: Action) {
  switch (action.type) {
    case "setAccount": {
      return { ...state, account: action.payload };
    }
    case "setCharacterNft": {
      return { ...state, characterNft: action.payload };
    }
    case "setCharacters": {
      return { ...state, characters: action.payload };
    }
    case "setGameContract": {
      return { ...state, gameContract: action.payload };
    }
    case "setBoss": {
      return { ...state, boss: action.payload };
    }
    default: {
      return state;
    }
  }
}

async function getCharacters(gameContract: MyEpicGame, dispatch: Dispatch) {
  console.log("Getting contract characters to mint");
  try {
    const charactersTxn = await gameContract.getAllDefaultCharacters();
    const characters = charactersTxn.map((characterData) =>
      transformCharacterData(characterData)
    );

    dispatch({ type: "setCharacters", payload: characters });
  } catch (error) {
    console.error("Something went wrong fetching characters:", error);
  }
}

function MetaMaskProvider({ children }: MetaMaskProviderProps) {
  const [state, dispatch] = useReducer(accountReducer, {
    account: "",
    characterNft: undefined,
    characters: [],
    gameContract: undefined,
    boss: undefined,
  });

  async function checkIfWalletConnected() {
    const { ethereum } = window;

    if (!ethereum) return;

    let accounts = [];
    try {
      accounts = await ethereum.request({ method: "eth_accounts" });
    } catch (err) {
      console.error(err);
    }

    if (accounts.length > 0) {
      dispatch({ type: "setAccount", payload: accounts[0] });
    } else {
      console.log("No authorized account found");
    }
  }

  async function fetchNftMetadata() {
    console.log("Checking for Character NFT on address:", state.account);

    const txn = await state?.gameContract?.checkIfUserHasNFT();
    if (txn?.name) {
      console.log("User has character NFT");
      dispatch({
        type: "setCharacterNft",
        payload: transformCharacterData(txn),
      });
    } else {
      console.log("No character NFT found!");
    }
  }

  async function onCharacterMint(
    sender: string,
    tokenId: BigInt,
    characterIndex: BigInt
  ) {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId} characterIndex: ${characterIndex}`
    );

    /*
     * Once our character NFT is minted we can fetch the metadata from our contract
     * and set it in state to move onto the Arena
     */
    if (state.gameContract) {
      const characterNft = await state.gameContract.checkIfUserHasNFT();
      console.log("CharacterNft: ", characterNft);
      dispatch({
        type: "setCharacterNft",
        payload: transformCharacterData(characterNft),
      });
    }
  }

  function onAttackCompleted(newBossHp: BigInt, newPlayerHp: BigInt) {
    console.log(
      `AttackComplete: Boss Hp: ${newBossHp} Player Hp: ${newPlayerHp}`
    );

    dispatch({
      type: "setBoss",
      payload: { ...state.boss, hp: newBossHp } as unknown as CharacterData,
    });
    dispatch({
      type: "setCharacterNft",
      payload: {
        ...state.characterNft,
        hp: newPlayerHp,
      } as unknown as CharacterData,
    });
  }

  useEffect(() => {
    checkIfWalletConnected();
    const contract = getGameContract();
    dispatch({ type: "setGameContract", payload: contract });
  }, []);

  useEffect(() => {
    if (state.account) {
      fetchNftMetadata();
    }
  }, [state.account]);

  useEffect(() => {
    const { gameContract } = state;
    if (gameContract) {
      getCharacters(gameContract, dispatch);
      gameContract.on("CharacterNftMinted", onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off("CharacterNftMinted", onCharacterMint);
      }
    };
  }, [state.gameContract]);

  const value = { state, dispatch };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
}

function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { MetaMaskProvider, useMetaMask };

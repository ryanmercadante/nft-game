import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";
import { MyEpicGame, MyEpicGame__factory } from "../typechain";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { getGameContract, transformCharacterData } from "../utils/helpers";

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
export type Action =
  | AddressAction
  | CharacterNftAction
  | CharactersAction
  | GameContractAction;
export type Dispatch = (action: Action) => void;
export type State = {
  account: string;
  characterNft: CharacterData | undefined;
  characters: CharacterData[];
  gameContract: MyEpicGame | undefined;
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
    if (state.gameContract) {
      getCharacters(state.gameContract, dispatch);
    }
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

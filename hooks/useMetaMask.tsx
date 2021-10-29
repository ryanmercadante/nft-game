import { createContext, useContext, useEffect, useReducer } from "react";

type Action = { type: "setAccount"; payload: string };
type Dispatch = (action: Action) => void;
type State = { account: string };
type MetaMaskProviderProps = { children: React.ReactNode };

const MetaMaskContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function accountReducer(_state: State, action: Action) {
  switch (action.type) {
    case "setAccount": {
      return { account: action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function MetaMaskProvider({ children }: MetaMaskProviderProps) {
  const [state, dispatch] = useReducer(accountReducer, { account: "" });

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

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

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

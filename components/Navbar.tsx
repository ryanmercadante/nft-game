import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "./Link";
import React, { FC } from "react";
import { useMetaMask } from "../hooks/useMetaMask";

export const Navbar: FC = () => {
  const {
    state: { account },
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

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          NFT Game
        </Typography>
        <nav>
          <Link
            variant="button"
            color="text.primary"
            href="/"
            sx={{ my: 1, mx: 1.5 }}
          >
            Home
          </Link>
          <Link
            variant="button"
            color="text.primary"
            href="/about"
            sx={{ my: 1, mx: 1.5 }}
          >
            About
          </Link>
          <Link
            variant="button"
            color="text.primary"
            href="https://opensea.io"
            target="_blank"
            sx={{ my: 1, mx: 1.5 }}
          >
            OpenSea
          </Link>
        </nav>
        {account ? (
          <Button
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            variant="outlined"
            sx={{
              my: 1,
              mx: 1.5,
              textTransform: "unset",
              borderRadius: 4,
            }}
            onClick={connectWallet}
          >
            <Typography
              sx={{
                width: 150,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {account}
            </Typography>
          </Button>
        ) : (
          <Button
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            onClick={connectWallet}
          >
            Connect with MetaMask
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

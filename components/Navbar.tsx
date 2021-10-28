import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "./Link";
import React, { FC } from "react";

export const Navbar: FC = () => {
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
        <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
          Connect with MetaMask
        </Button>
      </Toolbar>
    </AppBar>
  );
};

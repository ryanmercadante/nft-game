import { Fragment, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useMetaMask } from "../hooks/useMetaMask";
import { SelectCharacter } from "../components/SelectCharacter";

export default function Index() {
  const {
    state: { account, characterNft, characters },
  } = useMetaMask();

  function renderContent() {
    if (!account) {
      return <Typography>You must connect to metamask to play</Typography>;
    } else if (account && !characterNft) {
      return <SelectCharacter characters={characters} />;
    }
  }
  return (
    <Fragment>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        ⚔️ Metaverse Slayer ⚔️
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component="p"
      >
        Mint an NFT and team up with friends to battle against the big boss!
      </Typography>
      {renderContent()}
    </Fragment>
  );
}

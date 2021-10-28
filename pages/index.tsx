import * as React from "react";
import Typography from "@mui/material/Typography";

export default function Index() {
  return (
    <React.Fragment>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Metaverse Slayers
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component="p"
      >
        Mint an NFT and team up with friends to battle against the big boss!
      </Typography>
    </React.Fragment>
  );
}

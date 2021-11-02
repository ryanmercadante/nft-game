import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { CharacterData, useMetaMask } from "../hooks/useMetaMask";
import { CharacterCard } from "./CharacterCard";

interface SelectCharacterProps {
  characters: CharacterData[];
}

export const SelectCharacter: FC<SelectCharacterProps> = ({ characters }) => {
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

  return (
    <Container maxWidth="md" component="main">
      <Typography textAlign="center" variant="h5" marginY={4}>
        Mint your Hero. Choose wisely.
      </Typography>
      <Grid container spacing={5} alignItems="flex-end">
        {characters?.map((character, index) => (
          <CharacterCard
            key={character.name}
            character={character}
            mintCharacterNftAction={mintCharacterNftAction}
            index={index}
          />
        ))}
      </Grid>
    </Container>
  );
};

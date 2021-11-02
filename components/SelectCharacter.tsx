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
import Image from "next/image";
import { CharacterData, Dispatch } from "../hooks/useMetaMask";

interface SelectCharacterProps {
  dispatch: Dispatch;
  characters: CharacterData[];
}

export const SelectCharacter: FC<SelectCharacterProps> = ({ characters }) => {
  return (
    <Container maxWidth="md" component="main">
      <Typography textAlign="center" variant="h5" marginY={4}>
        Mint your Hero. Choose wisely.
      </Typography>
      <Grid container spacing={5} alignItems="flex-end">
        {characters?.map((character) => (
          <Grid
            item
            key={character.name}
            xs={12}
            sm={character.name === "Enterprise" ? 12 : 6}
            md={4}
          >
            <Card>
              <CardHeader
                title={character.name}
                titleTypographyProps={{ align: "center" }}
                action={character.name === "Pro" ? "*" : null}
                subheaderTypographyProps={{
                  align: "center",
                }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    mb: 2,
                  }}
                >
                  <Image
                    src={character.imageURI}
                    width={200}
                    height={200}
                    layout="fixed"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="outlined">
                  Mint {character.name}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

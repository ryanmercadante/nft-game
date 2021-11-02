import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import React from "react";
import { CharacterData } from "../hooks/useMetaMask";

interface CharacterCardProps {
  character: CharacterData;
  mintCharacterNftAction(characterId: number): Promise<void>;
  index: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  mintCharacterNftAction,
  index,
}) => {
  return (
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
          <Button
            fullWidth
            variant="outlined"
            onClick={() => mintCharacterNftAction(index)}
          >
            Mint {character.name}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

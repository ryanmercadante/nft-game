import { Container } from "@mui/material";
import React, { FC, Fragment } from "react";
import { Navbar } from "./Navbar";

export const Layout: FC = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      <Container
        disableGutters
        maxWidth="md"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        {children}
      </Container>
    </Fragment>
  );
};

import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { MetaMaskProvider } from "../hooks/useMetaMask";
import "../styles/_app.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <MetaMaskProvider>
        <Component {...pageProps} />
      </MetaMaskProvider>
    </React.Fragment>
  );
}

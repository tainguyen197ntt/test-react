import { AppProps } from "next/app";
import { useEffect } from "react";

const MyApp = ({ Component, pageProps }: AppProps) => {
  console.log("Hello, world!");
  return <Component {...pageProps} />;
};

export default MyApp;

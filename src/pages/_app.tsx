import { type AppType } from "next/app";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </SessionProvider>
  );
};

export default MyApp;

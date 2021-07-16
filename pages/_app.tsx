import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useApollo } from "../lib/apolloClient";
import { Provider } from "next-auth/client";
import "../styles/globals.css";
import { createContext, useEffect, useState } from "react";
import { theme } from "../types/theme";
import { useUpdate } from "../hooks/UpdateHooks";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "../components/feedback/Toast";

export const ThemeContext = createContext({
  currentTheme: theme.light,
  setCurrentTheme: (theme: theme) => {},
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [currentTheme, setCurrentTheme] = useState<theme>(theme.light);
  const themeContextValue = { currentTheme, setCurrentTheme };

  // Handle PWA updates
  useUpdate();

  useEffect(() => {
    if (currentTheme === theme.dark) {
      document.querySelector("body").classList.add("dark");
    } else {
      document.querySelector("body").classList.remove("dark");
    }
  }, [currentTheme]);

  const apolloClient = useApollo(
    pageProps.initialApolloState,
    process.env.PROXIED_API_URL
  );

  return (
    <Provider session={pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <ThemeContext.Provider value={themeContextValue}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer />
        </ThemeContext.Provider>
      </ApolloProvider>
    </Provider>
  );
};

export default MyApp;

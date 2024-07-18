import { store } from "@/data/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { theme } from "@/Theme";
import { CssBaseline, Experimental_CssVarsProvider } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Experimental_CssVarsProvider defaultMode="system" theme={theme}>
        <CssBaseline />

        <Component {...pageProps} />
      </Experimental_CssVarsProvider>
    </Provider>
  );
}

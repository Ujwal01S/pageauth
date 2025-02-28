import NavBar from "@/components/nav/navbar";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/lib/reactQueryProvider";
import NextAuthProvider from "@/lib/sessionProvider";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider>
      <QueryProvider>
        <NavBar>
          <Component {...pageProps} />
        </NavBar>
        <Toaster />
      </QueryProvider>
    </NextAuthProvider>
  );
}

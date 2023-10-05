import styles from "@/styles/Home.module.scss";
import React from "react";
import TextToSpeech from "./textToSpeech";
import Link from "next/link";
import { Auth0Provider } from "@auth0/auth0-react";
import Auth from "./components/Auth";

export default function Home() {
  return (
    <Auth0Provider
      domain={"dev-o21erkfo8i6wo4li.us.auth0.com"}
      clientId={"cUN0FkXf0YQJ1Ere19OOq6iXIyw15hy7"}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" && window.location.origin,
      }}
    >
      <main className={styles.main}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        <Auth />
      </main>
    </Auth0Provider>
  );
}

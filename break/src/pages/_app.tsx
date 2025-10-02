// src/pages/_app.tsx
import { AppProps } from 'next/app';
import '../app/globals.css'; 
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

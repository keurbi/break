// src/pages/_app.tsx
import { AppProps } from 'next/app';
import '../app/globals.css'; // Assurez-vous que ce chemin est correct

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

import TileProvider from "../src/components/tileProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <TileProvider>
      <Component {...pageProps} />;
    </TileProvider>
  );
}

export default MyApp;

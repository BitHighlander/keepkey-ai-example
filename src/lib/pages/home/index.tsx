import {
  Grid,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import Chat from "./chat";
import { useEffect, useState } from "react";

const Home = () => {
  const [sdk, setSdk] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [keepkeyConnected, setKeepKeyConnected] = useState(false);

  const onStart = async function () {
    try {
      const spec = "http://localhost:1646/spec/swagger.json";
      const apiKey = localStorage.getItem("apiKey") || "1234";
      const config = {
        apiKey,
        pairingInfo: {
          name: "KeepKey-template Demo App",
          imageUrl: "https://pioneers.dev/coins/keepkey.png",
          basePath: spec,
          url: "http://localhost:1646",
        },
      };
      // init
      const sdk = await KeepKeySdk.create(config);
      if (config.apiKey !== apiKey)
        localStorage.setItem("apiKey", config.apiKey);
      setApiKey(config.apiKey);
      const featuresKK = await sdk.system.info.getFeatures();
      // eslint-disable-next-line no-console
      console.log("features: ", featuresKK);
      if (featuresKK) {
        setKeepKeyConnected(true);
      } else {
        setTimeout(onStart, 2000);
      }

      console.log(sdk);
      // @ts-ignore
      setSdk(sdk);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, []);

  return (
    <Grid gap={4}>
      {keepkeyConnected ? (
        <div>
          <Chat sdk={sdk} apiKey={apiKey}></Chat>
        </div>
      ) : (
        <div>not Connected</div>
      )}
    </Grid>
  );
};

export default Home;

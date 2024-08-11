import {
  Box,
  Flex,
  Avatar,
  Link,
  AvatarBadge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import { useEffect, useState } from "react";

import KEEPKEY_ICON from "lib/assets/png/keepkey.png";

const spec = "http://localhost:1646/spec/swagger.json";
const configKeepKey: any = {
  pairingInfo: {
    name: "KeepKey-Template",
    imageUrl:
        "https://www.keepkey.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkeepkey_logo.407f5aca.png&w=3840&q=100",
    basePath: spec,
    url: "https://keepkey-template.vercel.app/",
  },
};

const checkKeepkeyAvailability = async (url: string) => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
};

let attempt = 0;

const checkAndLaunch = async () => {
  attempt++;
  if (!(await checkKeepkeyAvailability(spec))) {
    if (attempt === 3) {
      alert(
          "KeepKey desktop is required for keepkey-sdk, please go to https://keepkey.com/get-started"
      );
    } else {
      window.location.assign("keepkey://launch");
      await new Promise((resolve) => setTimeout(resolve, 30000));
      checkAndLaunch();
    }
  }
};

const Header = () => {
  const [keepkeyConnected, setKeepKeyConnected] = useState(false);
  const [keepkeyError, setKeepKeyError] = useState(false);
  const [features, setKeepKeyFeatures] = useState<any>({});

  const onStart = async function () {
    try {
      const apiKey = localStorage.getItem("apiKey") || "1234";
      configKeepKey.apiKey = apiKey;

      const sdk = await KeepKeySdk.create(configKeepKey);
      localStorage.setItem("apiKey", configKeepKey.apiKey);

      const featuresKK = await sdk.system.info.getFeatures();
      console.log("features: ", featuresKK);
      if (featuresKK) {
        setKeepKeyConnected(true);
      }
      setKeepKeyFeatures(featuresKK);
    } catch (e) {
      setKeepKeyError(true);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await checkAndLaunch();
      onStart();
    };
    initialize();
  }, []);

  return (
      <Flex
          as="header"
          width="full"
          align="center"
          justifyContent="flex-end"
          padding={4}
      >
        <Box>
          <Menu>
            <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
            >
              <Avatar size="lg" src={KEEPKEY_ICON}>
                {keepkeyConnected ? (
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                ) : (
                    <AvatarBadge boxSize="1.25em" bg="red.500" />
                )}
              </Avatar>
            </MenuButton>
            <MenuList>
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Device Features
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {keepkeyError ? (
                        <small>Bridge is offline!</small>
                    ) : (
                        <>
                          <small>
                            Version: {features?.major_version}.{features?.minor_version}
                            .{features?.patch_version}
                          </small>
                          <Box mt={2}>
                            <Link href="http://localhost:1646/docs" isExternal color="teal.500">
                              API Documentation
                            </Link>
                          </Box>
                        </>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
  );
};

export default Header;

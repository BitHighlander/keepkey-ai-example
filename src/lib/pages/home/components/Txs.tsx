import {
  Grid,
  Card,
  CardBody,
  Box,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Select,
  Code,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import SVG from "lib/assets/png/hold-and-release.svg";

const jsonFiles = [
  {
    name: "bnbTx.json",
    type: "binance",
    path: "./components/json/bnbTx.json",
    description: "Binance Coin Transaction",
  },
  {
    name: "btcSegWitTx.json",
    type: "bitcoin",
    path: "./components/json/btcSegWitTx.json",
    description: "Bitcoin SegWit Transaction",
  },
  {
    name: "cosmosAminoTx.json",
    type: "cosmos",
    path: "./cosmos/cosmosAminoTx.json",
    description: "Cosmos Amino Transaction",
  },
  {
    name: "dgbTx.json",
    type: "digiByte",
    path: "./components/json/dgbTx.json",
    description: "DigiByte Transaction",
  },
  {
    name: "ethTx.json",
    type: "ethereum",
    path: "./components/json/ethTx.json",
    description: "Ethereum Transaction",
  },
  {
    name: "osmosisAminoTx.json",
    type: "osmosis",
    path: "./osmosis/osmosisAminoTx.json",
    description: "Osmosis Amino Transaction",
  },
  {
    name: "thorchainTx.json",
    type: "thorchain",
    path: "./components/json/thorchainTx.json",
    description: "Thorchain Transaction",
  },
  {
    name: "btcBech32Tx.json",
    type: "bitcoinBech32",
    path: "./components/json/btcBech32Tx.json",
    description: "Bitcoin Bech32 Transaction",
  },
  {
    name: "btcTx.json",
    type: "bitcoin",
    path: "./components/json/btcTx.json",
    description: "Bitcoin Transaction",
  },
  {
    name: "dashTx.json",
    type: "dash",
    path: "./components/json/dashTx.json",
    description: "Dash Transaction",
  },
  {
    name: "dogeTx.json",
    type: "dogecoin",
    path: "./components/json/dogeTx.json",
    description: "Dogecoin Transaction",
  },
  {
    name: "ltcTx.json",
    type: "litecoin",
    path: "./components/json/ltcTx.json",
    description: "Litecoin Transaction",
  },
  {
    name: "rippleTx.json",
    type: "ripple",
    path: "./components/json/rippleTx.json",
    description: "Ripple Transaction",
  },
  {
    name: "arkeoAminoTx.json",
    type: "arkeo",
    path: "./arkeo/arkeoAminoTx.json",
    description: "Arkeo Amino Transaction",
  },
];

// @ts-ignore
const Txs = ({ sdk }) => {
  const [selectedTx, setSelectedTx] = useState(null);
  const [jsonContent, setJsonContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signResult, setSignResult] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook for modal

  const loadJsonContent = (fileName: string | React.SetStateAction<null>) => {
    // @ts-ignore
    setSelectedTx(fileName);
    const selectedFile = jsonFiles.find((file) => file.name === fileName);
    if (selectedFile) {
      import(`.${selectedFile.path}`)
        .then((content) => {
          // @ts-ignore
          setJsonContent(JSON.stringify(content, null, 2));
        })
        .catch((error) => {
          console.error("Error loading JSON:", error);
        });
    }
  };

  const openSign = async function () {
    try {
      onOpen();
      // @ts-ignore
      const input = JSON.parse(jsonContent);

      console.log("input: ", input);
      handleSign(input);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSign = async function (input: any) {
    try {
      let responseSign;
      console.log("selectedTx: ", selectedTx);
      const infoSelected = jsonFiles.find((file) => file.name === selectedTx);
      console.log("infoSelected: ", infoSelected);

      let inputs;
      let outputs;

      // @ts-ignore
      switch (infoSelected.type) {
        case "binance":
          console.log("Sign Binance TX");
          // @ts-ignore
          input = {
            addressNList: [2147483692, 2147483653, 2147483648, 0, 0],
            chain_id: "Binance-Chain-Nile",
            account_number: "24250",
            sequence: 31,
            // @ts-ignore
            tx: input,
          };
          // @ts-ignore
          console.log("raw tx: ", JSON.stringify(input));
          // @ts-ignore
          responseSign = await sdk.bnb.bnbSignTransaction(input);
          break;
        case "bitcoin":
          console.log("Sign Bitcoin TX");
          inputs = [
            {
              addressNList: [2147483692, 2147483653, 2147483648, 0, 0],
              scriptType: "p2pkh",
              amount: String(390000),
              vout: 0,
              txid: "d5f65ee80147b4bcc70b75e4bbf2d7382021b871bd8867ef8fa525ef50864882",
              // @ts-ignore
              tx: input,
              //hex: "0100000002cfdd9ee3b0ed9d9045f29a252d4c78ecac6c5814b67a29b5f6998fcff1036ac1010000008b483045022072ba61305fe7cb542d142b8f3299a7b10f9ea61f6ffaab5dca8142601869d53c0221009a8027ed79eb3b9bc13577ac2853269323434558528c6b6a7e542be46e7e9a820141047a2d177c0f3626fc68c53610b0270fa6156181f46586c679ba6a88b34c6f4874686390b4d92e5769fbb89c8050b984f4ec0b257a0e5c4ff8bd3b035a51709503ffffffffaf3e45194a9bb60c6108abe8d9d039e0618e8a147911c68f0c67598d2f9ae31a010000008b48304502200fd63adc8f6cb34359dc6cca9e5458d7ea50376cbd0a74514880735e6d1b8a4c0221008b6ead7fe5fbdab7319d6dfede3a0bc8e2a7c5b5a9301636d1de4aa31a3ee9b101410486ad608470d796236b003635718dfc07c0cac0cfc3bfc3079e4f491b0426f0676e6643a39198e8e7bdaffb94f4b49ea21baa107ec2e237368872836073668214ffffffff0170f30500000000001976a91424a56db43cf6f2b02e838ea493f95d8d6047423188ac00000000",
            },
          ];
          outputs = [
            {
              address: "1MJ2tj2ThBE62zXbBYA5ZaN3fdve5CPAz1",
              addressType: "spend",
              // scriptType: core.BTCOutputScriptType.PayToAddress,
              amount: String(390000 - 10000),
              isChange: false,
            },
          ];
          // @ts-ignore
          input = {
            coin: "Bitcoin",
            inputs,
            outputs,
            version: 1,
            locktime: 0,
          };
          // @ts-ignore
          console.log("Sign! ", JSON.stringify(input));
          console.log("sdk: ", sdk);
          console.log("sdk: ", sdk.utxo);
          // @ts-ignore
          responseSign = await sdk.utxo.utxoSignTransaction(input);
          break;
        case "cosmos":
          // @ts-ignore
          input = {
            addressNList: [2147483692, 2147483653, 2147483648, 0, 0],
            chain_id: "cosmoshub-4",
            account_number: "16359",
            sequence: "17",
            // @ts-ignore
            tx: input,
          };
          // @ts-ignore
          console.log("raw tx: ", JSON.stringify(input));
          // @ts-ignore
          responseSign = await sdk.cosmos.cosmosSignAmino(input);
          break;
        case "digiByte":
          responseSign = await sdk.dgb.signTransaction(input);
          break;
        case "ethereum":
          // @ts-ignore
          input = {
            typedData: input,
            addressNList: [2147483692, 2147483653, 2147483648, 0, 0],
          };
          // @ts-ignore
          responseSign = await sdk.eth.ethSignTx(input);
          break;
        case "osmosis":
          // @ts-ignore
          let input = {
            addressNList: [2147483692, 2147483653, 2147483648, 0, 0],
            chain_id: "osmosis-1",
            account_number: 100,
            sequence: 10,
            // @ts-ignore
            tx: input,
          };
          responseSign = await sdk.osmosis.osmosisSignTx(input);
          break;
        case "thorchain":
          responseSign = await sdk.thorchain.signTransaction(input);
          break;
        case "bitcoinBech32":
          inputs = [
            {
              addressNList: [2147483692, 2147483653, 2147483648, 0, 0],
              scriptType: "p2pkh",
              amount: String(390000),
              vout: 0,
              txid: "d5f65ee80147b4bcc70b75e4bbf2d7382021b871bd8867ef8fa525ef50864882",
              tx: input,
              //hex: "0100000002cfdd9ee3b0ed9d9045f29a252d4c78ecac6c5814b67a29b5f6998fcff1036ac1010000008b483045022072ba61305fe7cb542d142b8f3299a7b10f9ea61f6ffaab5dca8142601869d53c0221009a8027ed79eb3b9bc13577ac2853269323434558528c6b6a7e542be46e7e9a820141047a2d177c0f3626fc68c53610b0270fa6156181f46586c679ba6a88b34c6f4874686390b4d92e5769fbb89c8050b984f4ec0b257a0e5c4ff8bd3b035a51709503ffffffffaf3e45194a9bb60c6108abe8d9d039e0618e8a147911c68f0c67598d2f9ae31a010000008b48304502200fd63adc8f6cb34359dc6cca9e5458d7ea50376cbd0a74514880735e6d1b8a4c0221008b6ead7fe5fbdab7319d6dfede3a0bc8e2a7c5b5a9301636d1de4aa31a3ee9b101410486ad608470d796236b003635718dfc07c0cac0cfc3bfc3079e4f491b0426f0676e6643a39198e8e7bdaffb94f4b49ea21baa107ec2e237368872836073668214ffffffff0170f30500000000001976a91424a56db43cf6f2b02e838ea493f95d8d6047423188ac00000000",
            },
          ];
          outputs = [
            {
              address: "1MJ2tj2ThBE62zXbBYA5ZaN3fdve5CPAz1",
              addressType: "spend",
              // scriptType: core.BTCOutputScriptType.PayToAddress,
              amount: String(390000 - 10000),
              isChange: false,
            },
          ];
          input = {
            coin: "Bitcoin",
            inputs,
            outputs,
            version: 1,
            locktime: 0,
          };
          console.log("Sign! ", JSON.stringify(input));
          console.log("sdk: ", sdk);
          console.log("sdk: ", sdk.utxo);
          responseSign = await sdk.utxo.utxoSignTransaction(input);
          break;
        case "bitcoinSegWit":
          inputs = [
            {
              addressNList: [2147483692, 2147483653, 2147483648, 0, 0],
              scriptType: "p2pkh",
              amount: String(390000),
              vout: 0,
              txid: "d5f65ee80147b4bcc70b75e4bbf2d7382021b871bd8867ef8fa525ef50864882",
              tx: input,
              //hex: "0100000002cfdd9ee3b0ed9d9045f29a252d4c78ecac6c5814b67a29b5f6998fcff1036ac1010000008b483045022072ba61305fe7cb542d142b8f3299a7b10f9ea61f6ffaab5dca8142601869d53c0221009a8027ed79eb3b9bc13577ac2853269323434558528c6b6a7e542be46e7e9a820141047a2d177c0f3626fc68c53610b0270fa6156181f46586c679ba6a88b34c6f4874686390b4d92e5769fbb89c8050b984f4ec0b257a0e5c4ff8bd3b035a51709503ffffffffaf3e45194a9bb60c6108abe8d9d039e0618e8a147911c68f0c67598d2f9ae31a010000008b48304502200fd63adc8f6cb34359dc6cca9e5458d7ea50376cbd0a74514880735e6d1b8a4c0221008b6ead7fe5fbdab7319d6dfede3a0bc8e2a7c5b5a9301636d1de4aa31a3ee9b101410486ad608470d796236b003635718dfc07c0cac0cfc3bfc3079e4f491b0426f0676e6643a39198e8e7bdaffb94f4b49ea21baa107ec2e237368872836073668214ffffffff0170f30500000000001976a91424a56db43cf6f2b02e838ea493f95d8d6047423188ac00000000",
            },
          ];
          outputs = [
            {
              address: "1MJ2tj2ThBE62zXbBYA5ZaN3fdve5CPAz1",
              addressType: "spend",
              // scriptType: core.BTCOutputScriptType.PayToAddress,
              amount: String(390000 - 10000),
              isChange: false,
            },
          ];
          input = {
            coin: "Bitcoin",
            inputs,
            outputs,
            version: 1,
            locktime: 0,
          };
          console.log("Sign! ", JSON.stringify(input));
          console.log("sdk: ", sdk);
          console.log("sdk: ", sdk.utxo);
          responseSign = await sdk.utxo.utxoSignTransaction(input);
          break;
        case "dash":
          responseSign = await sdk.dash.signTransaction(input);
          break;
        case "dogecoin":
          responseSign = await sdk.doge.signTransaction(input);
          break;
        case "litecoin":
          responseSign = await sdk.ltc.signTransaction(input);
          break;
        case "ripple":
          responseSign = await sdk.xrp.signTransaction(input);
          break;
        case "arkeo":
          responseSign = await sdk.arkeo.signTransaction(input);
          break;
        default:
          console.error("Unknown chain type:", selectedTx);
          break;
      }
      setSignResult(responseSign);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Grid textAlign="center" gap={2}>
      <Select
        placeholder="Select a Tx"
        onChange={(e) => loadJsonContent(e.target.value)}
      >
        <option value="" disabled>
          Select a Tx
        </option>
        {jsonFiles.map((file) => (
          <option key={file.name} value={file.name}>
            {file.description}
          </option>
        ))}
      </Select>
      {selectedTx && (
        <Card>
          <CardHeader>
            <Heading size="md">JSON Content Preview</Heading>
          </CardHeader>
          <CardBody>
            <SyntaxHighlighter
              language="json"
              style={darcula}
              showLineNumbers
              wrapLines={false}
              customStyle={{ fontSize: "12px", overflowX: "auto" }}
            >
              {jsonContent}
            </SyntaxHighlighter>
            <Button onClick={openSign}>Sign Tx</Button>
          </CardBody>
        </Card>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            selectedTx: {selectedTx}
            <img src={SVG} alt="" />
            <br />
            signPath: {}
            <br />
            signResult: {JSON.stringify(signResult)}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

export default Txs;

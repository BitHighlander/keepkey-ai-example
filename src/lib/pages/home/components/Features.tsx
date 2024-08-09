import {
  Grid,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

//@ts-ignore
const Features = ({ sdk }) => {
  const [features, setFeatures] = React.useState({
    auto_lock_delay_ms: undefined,
    no_backup: false,
    firmware_hash: undefined,
    firmware_variant: undefined,
    model: undefined,
    policies: [],
    passphrase_cached: false,
    pin_cached: false,
    imported: false,
    bootloader_hash: undefined,
    revision: undefined,
    initialized: false,
    label: undefined,
    passphrase_protection: false,
    pin_protection: false,
    device_id: undefined,
    bootloader_mode: false,
    patch_version: 0,
    minor_version: 0,
    major_version: 0,
    vendor: undefined,
  });

  const onStart = async function () {
    try {
      console.log("sdk: ", sdk);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const featuresKK = await sdk.system.info.getFeatures();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFeatures(featuresKK);
      // eslint-disable-next-line no-console
      console.log("coins: ", featuresKK);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, [sdk]);

  return (
    <Grid textAlign="center" gap={2}>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Features</TableCaption>
          <Thead>
            <Tr>
              <Th>Feature Name</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Auto Lock Delay (ms)</Td>
              <Td>{features?.auto_lock_delay_ms}</Td>
            </Tr>
            <Tr>
              <Td>No Backup</Td>
              <Td>{features?.no_backup ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>Firmware Hash</Td>
              <Td>{features?.firmware_hash}</Td>
            </Tr>
            <Tr>
              <Td>Firmware Variant</Td>
              <Td>{features?.firmware_variant}</Td>
            </Tr>
            <Tr>
              <Td>Model</Td>
              <Td>{features?.model}</Td>
            </Tr>
            <Tr>
              {/* <Td>Policies</Td> */}
              {/* <Td> */}
              {/*  {features?.policies */}
              {/*    .map((policy) => policy?.policy_name) */}
              {/*    .join(", ")} */}
              {/* </Td> */}
            </Tr>
            <Tr>
              <Td>Passphrase Cached</Td>
              <Td>{features?.passphrase_cached ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>PIN Cached</Td>
              <Td>{features?.pin_cached ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>Imported</Td>
              <Td>{features?.imported ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>Bootloader Hash</Td>
              <Td>{features?.bootloader_hash}</Td>
            </Tr>
            <Tr>
              <Td>Revision</Td>
              <Td>{features?.revision}</Td>
            </Tr>
            <Tr>
              <Td>Initialized</Td>
              <Td>{features?.initialized ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>Label</Td>
              <Td>{features?.label}</Td>
            </Tr>
            <Tr>
              <Td>Passphrase Protection</Td>
              <Td>{features?.passphrase_protection ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>PIN Protection</Td>
              <Td>{features?.pin_protection ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>Device ID</Td>
              <Td>{features?.device_id}</Td>
            </Tr>
            <Tr>
              <Td>Bootloader Mode</Td>
              <Td>{features?.bootloader_mode ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>Version</Td>
              <Td>{`${features?.major_version}.${features?.minor_version}.${features?.patch_version}`}</Td>
            </Tr>
            <Tr>
              <Td>Vendor</Td>
              <Td>{features?.vendor}</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Feature Name</Th>
              <Th>Value</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default Features;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  HStack,
  Input,
  Spinner,
  Card,
  Select,
  Progress,
} from "@chakra-ui/react";
import { useInferenceChat } from "./inference";

export function Chat({ sdk, apiKey }: any) {
  const [models, setModels] = useState<{ model: string }[]>([]);
  const {
    conversation,
    input,
    setInput,
    model,
    submitMessage,
    getModels,
    selectedComponent,
    isDownloading,
    percent, // assuming this holds the percentage
  } = useInferenceChat(sdk, apiKey);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      const modelsList = await getModels();
      console.log("modelsList:", modelsList.models); // For debugging
      setModels(modelsList.models);
    };

    fetchModels();
  }, []);

  const handleSubmitMessage = async (message: string) => {
    setLoading(true);
    await submitMessage(message);
    setLoading(false);
  };

  return (
      <Box>
        {isDownloading ? (
            <Box textAlign="center" mt={4}>
              <Spinner size="xl" />
              <Text mt={4}>Downloading model, please wait...</Text>
              <Progress
                  value={percent}
                  size="lg"
                  colorScheme="blue"
                  mt={4}
                  borderRadius="md"
              />
              <Text mt={2}>{percent}%</Text>
            </Box>
        ) : (
            <>
              {/* Render selected component if necessary */}
              {selectedComponent && (
                  <Box mb={4}>
                    {/* Insert your selected component rendering logic here */}
                  </Box>
              )}

              {/* Models Dropdown */}
              {/*<Select placeholder="Select a model" mb={4}>*/}
              {/*  {models.map((model: any, index) => (*/}
              {/*      <option key={index} value={model.model}>*/}
              {/*        {model.model}*/}
              {/*      </option>*/}
              {/*  ))}*/}
              {/*</Select>*/}
              <Text>Model: {model}</Text>

              {/* Conversation Messages */}
              <Box>
                {conversation.slice(-10).map((msg, index) => (
                    <Card key={index} mb={4}>
                      <Box p={4}>
                        <Text>
                          {msg.role === "user" ? "User" : "Assistant"}: {msg.content}
                        </Text>
                      </Box>
                    </Card>
                ))}
              </Box>

              {/* Input and Submit Button */}
              <HStack spacing={4} mt={4}>
                <Input
                    placeholder="Type your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button onClick={() => handleSubmitMessage(input)} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Send"}
                </Button>
              </HStack>
            </>
        )}
      </Box>
  );
}

export default Chat;

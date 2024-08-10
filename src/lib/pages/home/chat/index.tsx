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
} from "@chakra-ui/react";
import { useInferenceChat } from "./inference";

export function Chat({sdk, apiKey}: any) {
  const {
    conversation,
    input,
    setInput,
    submitMessage,
    getModels,
    selectedComponent,
  } = useInferenceChat(sdk, apiKey);
  const [models, setModels] = useState<{ model: string }[]>([]);
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
        {/* Render selected component if necessary */}
        {selectedComponent && (
            <Box mb={4}>
              {/* Insert your selected component rendering logic here */}
            </Box>
        )}

        {/* Models Dropdown */}
        <Select placeholder="Select a model" mb={4}>
          {models.map((model:any, index) => (
              <option key={index} value={model.model}>
                {model.model}
              </option>
          ))}
        </Select>

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
      </Box>
  );
}

export default Chat;

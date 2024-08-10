import { useState, useEffect, useMemo } from "react";
import { PROMPTS_SYSTEM, TOOLS } from "./chart";
// @ts-ignore
import { Ollama } from "keepkey-ollama/browser";
import { EXAMPLE_WALLET } from "./functions/keepkey";

const TAG = " | inference | ";

export const useInferenceChat = (sdk, apiKey, initialModel = "sam4096/qwen2tools:0.5b") => {
  const [model, setModel] = useState(initialModel);
  const [messages, setMessages] = useState<any>([]);
  const [conversation, setConversation] = useState<any>([]);
  const [input, setInput] = useState("");
  const [selectedComponent, setSelectedComponent] =
      useState<string>("portfolio");

  const ollama = useMemo(() => {
    console.log("API Key:", apiKey); // Debugging statement
    return new Ollama({
      host: "http://127.0.0.1:1646/ollama",
      apiKey,
    });
  }, [apiKey]);

  const getModels = async () => {
    try {
      const models = await ollama.list();
      console.log("models: ", models);
      return models;
    } catch (e) {
      console.error(TAG, "Failed to fetch models:", e);
    }
  };

  const onStart = async () => {
    const tag = TAG + " | onStart | ";
    try {
      const featuresKK = await sdk.system.info.getFeatures();
      console.log("features: ", featuresKK);

      const version = `${featuresKK.major_version}.${featuresKK.minor_version}.${featuresKK.patch_version}`;
      const summary = `Tell the user they are connected to their KeepKey. Only return the version: ${version}.`;

      const messagesInit = [
        ...PROMPTS_SYSTEM,
        { role: "user", content: summary },
        {
          role: "user",
          content: "KeepKey details: " + JSON.stringify(featuresKK),
        },
      ];

      console.log(tag, "messagesInit: ", messagesInit);

      const response = await ollama.chat({
        model,
        messages: messagesInit,
        tools: [],
      });

      if (response.message?.content) {
        setConversation((prev: any) => [...prev, response.message]);
      }

      console.log(tag, "response: ", response);
      console.log(tag, "content: ", response.message?.content);
    } catch (e) {
      console.error(tag, "Error during onStart:", e);
    }
  };

  useEffect(() => {
    onStart();
  }, []);

  const walletFunctions = EXAMPLE_WALLET();

  const availableFunctions: any = {
    ...walletFunctions,
    showComponent: async ({ component }: { component: string }) => {
      setSelectedComponent(component);
      return `Component ${component} has been added to the dashboard.`;
    },
  };

  const submitMessage = async (message: any) => {
    const tag = TAG + " | submitMessage | ";
    try {
      const newMessages = [
        ...messages,
        ...PROMPTS_SYSTEM,
        { role: "user", content: message },
      ];
      setMessages(newMessages);

      const response = await ollama.chat({
        model,
        messages: newMessages,
        tools: TOOLS,
      });

      console.log(tag, "response: ", response);
      const result = response?.message || {};

      if (result?.content) {
        setConversation((prev: any) => [...prev, result]);
      }

      const isFunction = result?.tool_calls;

      if (isFunction && isFunction.length > 0) {
        const functionCall = isFunction[0];
        const functionName = functionCall?.function?.name;

        if (availableFunctions[functionName]) {
          const functionResponse = await availableFunctions[functionName](
            functionCall.function.arguments
          );

          const toolResponseMessage = {
            role: "tool",
            content: `The response for ${functionName} is ${functionResponse}`,
          };

          newMessages.push(toolResponseMessage);
          newMessages.push({
            role: "system",
            content: `You are a summary agent. The system made tool calls. You are to put together a response that understands the user's intent, interprets the information returned from the tools, then summarizes for the user. If you are more than 80% sure the answer is logical, tell the user this. Otherwise, apologize for failing and return the logic of why you think the response is wrong.`,
          });

          const finalResponse = await ollama.chat({
            model,
            messages: newMessages,
            tools: TOOLS,
          });

          setConversation((prev: any) => [
            ...prev,
            finalResponse.message,
          ]);
        } else {
          console.log(`Function ${functionName} not found.`);
        }
      }
    } catch (e) {
      console.error(tag, e);
    }
  };

  return {
    model,
    getModels,
    setModel,
    messages,
    conversation,
    input,
    setInput,
    submitMessage,
    selectedComponent,
    setSelectedComponent,
  };
};

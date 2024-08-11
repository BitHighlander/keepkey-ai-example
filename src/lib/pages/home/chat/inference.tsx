import { useState, useEffect, useMemo } from "react";
import { PROMPTS_SYSTEM, TOOLS } from "./chart";
// @ts-ignore
import { Ollama } from "keepkey-ollama/browser";
import { EXAMPLE_WALLET } from "./functions/keepkey";

const TAG = " | inference | ";

const MODELS_KNOWN = [
  "mistral:latest", //Recomended for tools
  "llama3.1:latest",
];

export const useInferenceChat = (sdk, apiKey, initialModel = "mistral") => {
  const [model, setModel] = useState(initialModel);
  const [isDownloading, setIsDownloading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [messages, setMessages] = useState<any>([]);
  const [conversation, setConversation] = useState<any>([]);
  const [input, setInput] = useState("");
  const [selectedComponent, setSelectedComponent] =
    useState<string>("portfolio");

  const ollama = useMemo(() => {
    console.log("API Key:", apiKey); // Debugging statement
    return new Ollama({
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

  const isModelAvailable = async function (model: string) {
    try {
      const modelsList = await getModels();
      console.log("modelsList: ", modelsList);

      // Ensure that modelsList.models is an array before attempting to access it
      const models = modelsList?.models ?? [];

      // Check if the provided model string matches the model property in any object
      return models.some(
        (modelObj: { model: string }) => modelObj.model === model
      );
    } catch (error) {
      console.error("Error checking model availability:", error);
      return false;
    }
  };

  const downloadModel = async function (model: string) {
    console.log(`Downloading model: ${model}...`);
    setIsDownloading(true);
    let currentDigestDone = false;

    // Use ollama.pull to download the model with streaming
    const stream = await ollama.pull({ model: model, stream: true });

    // Loop through the stream to track progress
    for await (const part of stream) {
      if (part.digest) {
        let percent = 0;
        if (part.completed && part.total) {
          percent = Math.round((part.completed / part.total) * 100);
        }
        console.log("percent: ", percent);
        setPercent(percent);
        if (percent === 100 && !currentDigestDone) {
          currentDigestDone = true;
        } else {
          currentDigestDone = false;
        }
      } else {
        console.log(part.status);
      }
    }

    console.log(`Model ${model} downloaded successfully.`);
  };

  const onStart = async () => {
    const tag = TAG + " | onStart | ";
    try {
      const featuresKK = await sdk.system.info.getFeatures();
      console.log("features: ", featuresKK);
      if (!featuresKK) throw Error("Failed to connect to keepkey!");

      const prefurredModel = MODELS_KNOWN[0];
      //make sure model is available

      //make sure model is available
      const available = await isModelAvailable(prefurredModel);
      console.log("available: ", available);

      if (!available) {
        console.log(`Model ${prefurredModel} is not available. Downloading...`);
        await downloadModel(prefurredModel);
      } else {
        console.log(`Model ${model} is already available.`);
        setModel(prefurredModel);
        setIsDownloading(false);
      }

      // const version = `${featuresKK.major_version}.${featuresKK.minor_version}.${featuresKK.patch_version}`;
      // const summary = `Tell the user they are connected to their KeepKey. Only return the version: ${version}.`;
      //
      // const messagesInit = [
      //   ...PROMPTS_SYSTEM,
      //   { role: "user", content: summary },
      //   {
      //     role: "user",
      //     content: "KeepKey details: " + JSON.stringify(featuresKK),
      //   },
      // ];
      // console.log(tag, "messagesInit: ", messagesInit);
      //
      // const response = await ollama.chat({
      //   model,
      //   messages: messagesInit,
      //   tools: [],
      // });
      //
      // if (response.message?.content) {
      //   setConversation((prev: any) => [...prev, response.message]);
      // }
      //
      // console.log(tag, "response: ", response);
      // console.log(tag, "content: ", response.message?.content);
    } catch (e) {
      console.error(tag, "Error during onStart:", e);
    }
  };

  useEffect(() => {
    onStart();
  }, [sdk]);

  const walletFunctions = EXAMPLE_WALLET(sdk);

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

      console.log("TOOLS: ", TOOLS);
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
      console.log("isfunction: ", isFunction);
      if (isFunction && isFunction.length > 0) {
        for (let i = 0; i < isFunction.length; i++) {
          const functionCall = isFunction[i];
          console.log("functionCall: ", functionCall);
          const functionName = functionCall?.function?.name;
          console.log("functionName: ", functionName);
          if (availableFunctions[functionName]) {
            const functionResponse = await availableFunctions[functionName](
              functionCall.function.arguments
            );
            const toolResponseMessage = {
              role: "tool",
              content: `The response for ${functionName} is ${JSON.stringify(
                functionResponse
              )}`,
            };
            console.log(tag, "toolResponseMessage: ", toolResponseMessage);
            newMessages.push(toolResponseMessage);
          } else {
            console.error("Function not found: ", functionName);
          }
        }
        newMessages.push({
          role: "system",
          content: `You are a summary agent. The system made tool calls. You are to put together a response that understands the user's intent, interprets the information returned from the tools, then summarizes for the user. If you are more than 80% sure the answer is logical, tell the user this. Otherwise, apologize for failing and return the logic of why you think the response is wrong.`,
        });
        console.log(tag, "newMessages: ", newMessages);
        const finalResponse = await ollama.chat({
          model,
          messages: newMessages,
          tools: TOOLS,
        });
        console.log(tag, "finalResponse: ", finalResponse);
        const finalResult = finalResponse?.message || {};
        if (finalResult?.content) {
          setConversation((prev: any) => [...prev, finalResult]);
        }
      }
    } catch (e) {
      console.error(tag, e);
    }
  };

  return {
    model,
    isDownloading,
    percent,
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

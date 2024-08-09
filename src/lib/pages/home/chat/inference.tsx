/*
     Pioneer Chat Inference

 */
import { useState, useEffect } from "react";
import { PROMPTS_SYSTEM, TOOLS } from "./chart";
import ollama from "ollama/browser";
import { EXAMPLE_WALLET } from "./functions/keepkey";
const TAG = " | inference | ";

export const useInferenceChat = (sdk, initialModel = "llama3.1") => {
  const [model, setModel] = useState(initialModel);
  const [messages, setMessages] = useState<any>([]);
  const [conversation, setConversation] = useState<any>([]);
  const [input, setInput] = useState("");
  const [selectedComponent, setSelectedComponent] =
    useState<string>("portfolio");

  const getModels = async () => {
    // let models = await ollama.show({model})
    const models = await ollama.list();
    console.log("models: ", models);
    return models;
  };

  const onStart = async () => {
    const tag = TAG + " | onStart | ";
    try {
      //get features
      const featuresKK = await sdk.system.info.getFeatures();
      console.log("features: ", featuresKK);

      const summary = `tell the user they are connected to their keepkey. only return the version, the version is made by combining the major_version, minor_version, and patch_version. the version is ${featuresKK.major_version}.${featuresKK.minor_version}.${featuresKK.patch_version}`
      const messagesInit = [
        ...PROMPTS_SYSTEM,
        { role: "user", content: summary },
        {
          role: "user",
          content: "keepkey details: " + JSON.stringify(featuresKK),
        },
      ];
      // setMessages(messagesInit);
      console.log(tag, "messagesInit: ", messagesInit);
      // let messages = PROMPTS_SYSTEM;

      const response = await ollama.chat({ model, messages: messagesInit });
      console.log(tag, "response: ", response);
      console.log(tag, "content: ", response.message.content);
      if (response.message.content)
        setConversation([...conversation, response.message]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, []);

  const walletFunctions = EXAMPLE_WALLET();

  const availableFunctions: any = {
    ...walletFunctions,
    showComponent: async (params: { component: any }) => {
      setSelectedComponent(params.component);
      return `Component ${params.component} has been added to the dashboard.`;
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
        model: model,
        messages: newMessages,
        tools: TOOLS,
      });
      console.log(tag, "response: ", response);
      const result = response.message;
      const isFunction = result.function_call;
      if (!isFunction) {
        setConversation([...conversation, result]);
        return;
      }

      const functionCall = result.message.function_call;
      const functionName = functionCall.name;
      const functionArguments = JSON.parse(functionCall.arguments);

      if (availableFunctions[functionName]) {
        const functionResponse = await availableFunctions[functionName](
          functionArguments
        );
        newMessages.push({
          role: "system",
          content: `The response for ${functionName} is ${functionResponse} with arguments ${JSON.stringify(
            functionArguments
          )}`,
        });
        newMessages.push({
          role: "system",
          content: `you are a summary agent. the system made tool calls. you are to put together a response that understands the user's intent, and attempts to interpret the information returned from the tools, then summarize for the user. you are to make an inference if the solution is correct, if you are more than 80% sure the answer is logical you tell the user this. otherwise you apologize for failing and return the logic of why you think the response is wrong.`,
        });

        const finalResponse = await ollama.chat({
          model,
          messages: newMessages,
          tools: TOOLS,
        });
        console.log(tag, "finalResponse: ", finalResponse);
        console.log(tag, "content: ", finalResponse.message.content);
        setConversation([...conversation, finalResponse.message.content]);
      } else {
        console.log(`Function ${functionName} not found.`);
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

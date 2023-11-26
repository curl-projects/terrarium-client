import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs";
import { z } from "zod";
import type {
  AIMessage,
  AgentAction,
  AgentFinish,
  AgentStep,
} from "langchain/schema";
import { RunnableSequence } from "langchain/schema/runnable";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { formatToOpenAIFunction } from "langchain/tools";
import { AgentExecutor } from "langchain/agents";
import { formatForOpenAIFunctions } from "langchain/agents/format_scratchpad";

export async function respondToMessage(messageContent){
    // RETRIEVER
    // Read text file & embed documents
    const text = fs.readFileSync("/Users/finnmacken/Desktop/NewCode/terrarium/terrarium-client/app/mock-data/state_of_the_union.txt", "utf8");
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    let docs = await textSplitter.createDocuments([text]);
    // Add fake document source information to the metadata
    docs = docs.map((doc, i) => ({
    ...doc,
    metadata: {
      page_chunk: i,
    },
    }));
    // Initialize docs & create retriever
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_KEY}));

    const retriever = vectorStore.asRetriever();


    const retrieverTool = createRetrieverTool(retriever, {
        name: "state-of-union-retriever",
        description:
          "Query a retriever to get information about state of the union address",
      });

    // STRUCTURED RESPONSE
    const responseSchema = z.object({
    answer: z.string().describe("The final answer to respond to the user"),
    sources: z
        .array(z.string())
        .describe(
        "List of page chunks that contain answer to the question. Only include a page chunk if it contains relevant information"
        ),
    });

    const structuredOutputParser = (
        output: AIMessage
      ): AgentAction | AgentFinish => {
        // If no function call is passed, return the output as an instance of `AgentFinish`
        if (!("function_call" in output.additional_kwargs)) {
          return { returnValues: { output: output.content }, log: output.content };
        }
        // Extract the function call name and arguments
        const functionCall = output.additional_kwargs.function_call;
        const name = functionCall?.name as string;
        const inputs = functionCall?.arguments as string;
        // Parse the arguments as JSON
        const jsonInput = JSON.parse(inputs);
        // If the function call name is `response` then we know it's used our final
        // response function and can return an instance of `AgentFinish`
        if (name === "response") {
          return { returnValues: { ...jsonInput }, log: output.content };
        }
        // If none of the above are true, the agent is not yet finished and we return
        // an instance of `AgentAction`
        return {
          tool: name,
          toolInput: jsonInput,
          log: output.content,
        };
      };      
    
    // PROMPTING
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
        new MessagesPlaceholder("agent_scratchpad"),
        ["user", "{input}"],
      ]);
      
      const responseOpenAIFunction = {
        name: "response",
        description: "Return the response to the user",
        parameters: zodToJsonSchema(responseSchema),
      };
      
      // LLM CONSTRUCTION
      const llm = new ChatOpenAI({openAIApiKey: process.env.OPENAI_KEY});
      
      const llmWithTools = llm.bind({
        functions: [formatToOpenAIFunction(retrieverTool), responseOpenAIFunction],
      });
      /** Create the runnable */
      const runnableAgent = RunnableSequence.from([
        {
          input: (i: { input: string }) => i.input,
          agent_scratchpad: (i: { input: string; steps: Array<AgentStep> }) =>
            formatForOpenAIFunctions(i.steps),
        },
        prompt,
        llmWithTools,
        structuredOutputParser,
      ]);
      
      const executor = AgentExecutor.fromAgentAndTools({
        agent: runnableAgent,
        tools: [retrieverTool],
      });
      /** Call invoke on the agent */
      const res = await executor.invoke({
        input: "what did the president say about kentaji brown jackson",
      });
      
    return res
}
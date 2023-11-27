import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { OpenAI } from "langchain/llms/openai";
import { RunnableSequence } from "langchain/schema/runnable";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { ChainTool } from "langchain/tools";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { FunctionMessage } from "langchain/schema"
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { formatToOpenAIFunction } from "langchain/tools";
import { AgentExecutor } from "langchain/agents";
import { formatForOpenAIFunctions } from "langchain/agents/format_scratchpad";
import { db } from "~/models/db.server";
import { Document } from "langchain/document";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { ChatMessageHistory } from "langchain/memory";

async function getPinnedFRsAndEmbeddings(featureId){
  const pinnedFRs = await db.featureRequestMap.findMany({
    where: {
      AND: {
        featureId: parseInt(featureId),
        pinned: true
      }
    },
    select: {
      featureRequestId: true
    }
  })

  return pinnedFRs
}


export async function respondToMessage(messageContent, featureId){
  const pinnedFRs = await getPinnedFRsAndEmbeddings(featureId)
        
    console.log("PINNED FRS:", pinnedFRs)

    const docs = pinnedFRs.map(fr => new Document({pageContent: fr.featureRequest.fr, metadata: {id: fr.featureRequest.fr_id}}))

    console.log("DOCS:", docs, docs[0])

    // Initialize docs & create retriever
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_KEY}));

    const retriever = vectorStore.asRetriever()

    const retrieverTool = createRetrieverTool(retriever, {
      name: "search_feature_requests",
      description:
        "Searches and returns feature requests in the evidence file.",
    });
    
    // TOOL DECLARATION
    tools = [retrieverTool]

    // CONSTRUCTING THE AGENT
  // load previous messages in here
  const previousMessages = [
  ];
  
  const chatHistory = new ChatMessageHistory(previousMessages);
  
  const memory = new OpenAIAgentTokenBufferMemory({
    llm: new ChatOpenAI({openAIApiKey: process.env.OPENAI_KEY}),
    memoryKey: "chat_history",
    outputKey: "output",
    chatHistory,
  });

  // RESPONSE SCHEMA:
  const responseSchema = StructuredOutputParser.fromZodSchema(z.object({
        answer: z.string().describe("The final answer to respond to the user"),
        sources: z
            .array(z.string())
            .describe(
            "List of documents that contain answers to the question. Only include a document if it contains relevant information. It's okay not to include any documents. These documents should be in the form of string IDs, which can be found in the metadata of each returned object from the retriever."
            ),
        })
  )
    
  const llm = new ChatOpenAI({model: "gpt-3.5-turbo-0613", openAIApiKey: process.env.OPENAI_KEY, temperature: 0});
  
  const prefix = `Do your best to answer the questions. Feel free to use any tools available to look up relevant information, only if necessary. Include relevant document ids in your answer when you use the FeatureRequestSearch tool to answer a question.`

  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "openai-functions",
    memory,
    returnIntermediateSteps: true,
    agentArgs: {
      prefix: prefix,
      outputParser: responseSchema
    },
  });  

  const result = await executor.invoke({
    input: messageContent,
  });
  
  console.log("FINAL RESULT:", result)
  return result
}























































































export async function respondToMessageOld(messageContent, featureId){
        const pinnedFRs = await getPinnedFRsAndEmbeddings(featureId)
          
        console.log("PINNED FRS:", pinnedFRs)

        const docs = pinnedFRs.map(fr => new Document({pageContent: fr.featureRequest.fr, metadata: {id: fr.featureRequest.fr_id}}))

        console.log("DOCS:", docs, docs[0])

        // Initialize docs & create retriever
        const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_KEY}));

        const retrieverModel = new OpenAI({ temperature: 0, openAIApiKey: process.env.OPENAI_KEY });
        const retrieverChain = VectorDBQAChain.fromLLM(retrieverModel, vectorStore);

        const qaTool = new ChainTool({
          name: "feature-request-search",
          description:
            "Query this retriever to get information about specific feature requests",
          chain: retrieverChain,
        });
        

      /** Define your list of tools. */
      const tools = [qaTool];
      /**
       * Define your chat model to use.
       * In this example we'll use gpt-4 as it is much better
       * at following directions in an agent than other models.
       */
      const model = new ChatOpenAI({ model: "gpt-3.5-turbo-0613", temperature: 0, openAIApiKey: process.env.OPENAI_KEY});
      /**
       * Define your prompt for the agent to follow
       * Here we're using `MessagesPlaceholder` to contain our agent scratchpad
       * This is important as later we'll use a util function which formats the agent
       * steps into a list of `BaseMessages` which can be passed into `MessagesPlaceholder`
       */
      const prompt = ChatPromptTemplate.fromMessages([
        ["ai", "You are a helpful assistant"],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad"),
      ]);
      /**
       * Bind the tools to the LLM.
       * Here we're using the `formatToOpenAIFunction` util function
       * to format our tools into the proper schema for OpenAI functions.
       */
      const modelWithFunctions = model.bind({
        functions: [...tools.map((tool) => formatToOpenAIFunction(tool))],
      });
      /**
       * Define a new agent steps parser.
       */
      const formatAgentSteps = (steps) =>
        steps.flatMap(({ action, observation }) => {
          if ("messageLog" in action && action.messageLog !== undefined) {
            const log = action.messageLog;
            return log.concat(new FunctionMessage(observation, action.tool));
          } else {
            return [new AIMessage(action.log)];
          }
        });
      /**
       * Construct the runnable agent.
       *
       * We're using a `RunnableSequence` which takes two inputs:
       * - input --> the users input
       * - agent_scratchpad --> the previous agent steps
       *
       * We're using the `formatForOpenAIFunctions` util function to format the agent
       * steps into a list of `BaseMessages` which can be passed into `MessagesPlaceholder`
       */
      const runnableAgent = RunnableSequence.from([
        {
          input: i => i.input,
          agent_scratchpad: i => formatAgentSteps(i.steps),
        },
        prompt,
        modelWithFunctions,
        new OpenAIFunctionsAgentOutputParser(),
      ]);
      /** Pass the runnable along with the tools to create the Agent Executor */
      const executor = AgentExecutor.fromAgentAndTools({
        agent: runnableAgent,
        tools,
      });

      console.log("Loaded agent executor");

      const result = await executor.invoke({
        input: messageContent,
      });

      console.log("FINAL RESULT:", result)
      return result
}


















































// export async function respondToMessageOld(messageContent, featureId){
//   // RETRIEVER
//   // Read text file & embed documents

//   const pinnedFRs = await getPinnedFRsAndEmbeddings(featureId)
  
//   console.log("PINNED FRS:", pinnedFRs)

//   const docs = pinnedFRs.map(fr => new Document({pageContent: fr.featureRequest.fr, metadata: {id: fr.featureRequest.fr_id}}))

//   console.log("DOCS:", docs, docs[0])

//   // Initialize docs & create retriever
//   const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_KEY}));

//   const retriever = vectorStore.asRetriever();


//   const retrieverTool = createRetrieverTool(retriever, {
//       name: "FeatureRequestSearch",
//       description:
//         "Query this retriever to get feature request information",
//     });

//   // STRUCTURED RESPONSE
//   const responseSchema = z.object({
//   answer: z.string().describe("The final answer to respond to the user"),
//   sources: z
//       .array(z.string())
//       .describe(
//       "List of documents that contain answers to the question. Only include a document if it contains relevant information. It's okay not to include any documents. These documents should be in the form of string IDs, which can be found in the metadata of each returned object from the retriever."
//       ),
//   });

//   const structuredOutputParser = (
//       output: AIMessage
//     ): AgentAction | AgentFinish => {
//       // If no function call is passed, return the output as an instance of `AgentFinish`

//       console.log("OUTPUT:", output)
//       if (output.additional_kwargs.function_call === undefined) {
//         return { returnValues: { output: output.content }, log: output.content };
//       }
//       // Extract the function call name and arguments
//       const functionCall = output.additional_kwargs.function_call;
//       const name = functionCall?.name as string;
//       const inputs = functionCall?.arguments as string;
//       // Parse the arguments as JSON
//       console.log("INPUTS:", inputs)
//       const jsonInput = JSON.parse(inputs);
//       // If the function call name is `response` then we know it's used our final
//       // response function and can return an instance of `AgentFinish`
//       if (name === "response") {
//         return { returnValues: { ...jsonInput }, log: output.content };
//       }
//       // If none of the above are true, the agent is not yet finished and we return
//       // an instance of `AgentAction`
//       return {
//         tool: name,
//         toolInput: jsonInput,
//         log: output.content,
//       };
//     };      
  
//   // PROMPTING
//     const prompt = ChatPromptTemplate.fromMessages([
//       ["system", "You are a helpful assistant. Include relevant document ids in your answer when you use the FeatureRequestSearch tool to answer a question. These document ids can be found in the metadata of each Document object."],
//       ["user", "{input}"],
//       new MessagesPlaceholder("agent_scratchpad"),
//     ]);
    
//     const responseOpenAIFunction = {
//       name: "response",
//       description: "Return the response to the user",
//       parameters: zodToJsonSchema(responseSchema),
//     };

//     // LLM CONSTRUCTION
//     const llm = new ChatOpenAI({model: "gpt-3.5-turbo-0613", openAIApiKey: process.env.OPENAI_KEY, temperature: 0});
    
//     const llmWithTools = llm.bind({
//       functions: [formatToOpenAIFunction(retrieverTool), responseOpenAIFunction],
//     });
//     /** Create the runnable */
//     const runnableAgent = RunnableSequence.from([
//       {
//         input: (i: { input: string }) => i.input,
//         agent_scratchpad: (i: { input: string; steps: Array<AgentStep> }) =>
//           formatForOpenAIFunctions(i.steps),
//       },
//       prompt,
//       llmWithTools,
//       structuredOutputParser,
//     ]);
    
//     const executor = await initializeAgentExecutorWithOptions([retrieverTool], llm,
//       {
//         agentType: "chat-zero-shot-react-description",
//         returnIntermediateSteps: true,
//       }
//     );
//     /** Call invoke on the agent */
//     const res = await executor.invoke({
//       input: messageContent,
//     });
  
//     console.log("RESPONSE:", res)
    
//   return res
// }


// export async function respondToMessageOldTWO(messageContent, featureId){
//     // RETRIEVER
//     // Read text file & embed documents

//     const pinnedFRs = await getPinnedFRsAndEmbeddings(featureId)
    
//     console.log("PINNED FRS:", pinnedFRs)

//     const docs = pinnedFRs.map(fr => new Document({pageContent: fr.featureRequest.fr, metadata: {id: fr.featureRequest.fr_id}}))

//     console.log("DOCS:", docs, docs[0])

//     // Initialize docs & create retriever
//     const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_KEY}));

//     const retriever = vectorStore.asRetriever();


//     const retrieverTool = createRetrieverTool(retriever, {
//         name: "FeatureRequestSearch",
//         description:
//           "Query this retriever to get feature request information",
//       });

//     // STRUCTURED RESPONSE
//     const responseSchema = z.object({
//     answer: z.string().describe("The final answer to respond to the user"),
//     sources: z
//         .array(z.string())
//         .describe(
//         "List of documents that contain answers to the question. Only include a document if it contains relevant information. It's okay not to include any documents. These documents should be in the form of string IDs, which can be found in the metadata of each returned object from the retriever."
//         ),
//     });

//     const structuredOutputParser = (
//         output: AIMessage
//       ): AgentAction | AgentFinish => {
//         // If no function call is passed, return the output as an instance of `AgentFinish`

//         console.log("OUTPUT:", output)
//         if (output.additional_kwargs.function_call === undefined) {
//           return { returnValues: { output: output.content }, log: output.content };
//         }
//         // Extract the function call name and arguments
//         const functionCall = output.additional_kwargs.function_call;
//         const name = functionCall?.name as string;
//         const inputs = functionCall?.arguments as string;
//         // Parse the arguments as JSON
//         console.log("INPUTS:", inputs)
//         const jsonInput = JSON.parse(inputs);
//         // If the function call name is `response` then we know it's used our final
//         // response function and can return an instance of `AgentFinish`
//         if (name === "response") {
//           return { returnValues: { ...jsonInput }, log: output.content };
//         }
//         // If none of the above are true, the agent is not yet finished and we return
//         // an instance of `AgentAction`
//         return {
//           tool: name,
//           toolInput: jsonInput,
//           log: output.content,
//         };
//       };      
    
//     // PROMPTING
//       const prompt = ChatPromptTemplate.fromMessages([
//         ["system", "You are a helpful assistant. Include relevant document ids in your answer when you use the FeatureRequestSearch tool to answer a question. These document ids can be found in the metadata of each Document object."],
//         ["user", "{input}"],
//         new MessagesPlaceholder("agent_scratchpad"),
//       ]);
      
//       const responseOpenAIFunction = {
//         name: "response",
//         description: "Return the response to the user",
//         parameters: zodToJsonSchema(responseSchema),
//       };

//       // LLM CONSTRUCTION
//       const llm = new ChatOpenAI({openAIApiKey: process.env.OPENAI_KEY, temperature: 0});
      
//       const llmWithTools = llm.bind({
//         functions: [formatToOpenAIFunction(retrieverTool), responseOpenAIFunction],
//       });
//       /** Create the runnable */
//       const runnableAgent = RunnableSequence.from([
//         {
//           input: (i: { input: string }) => i.input,
//           agent_scratchpad: (i: { input: string; steps: Array<AgentStep> }) =>
//             formatForOpenAIFunctions(i.steps),
//         },
//         prompt,
//         llmWithTools,
//         structuredOutputParser,
//       ]);
      
//       const executor = await initializeAgentExecutorWithOptions([retrieverTool], llm,
//         {
//           agentType: "chat-zero-shot-react-description",
//           returnIntermediateSteps: true,
//         }
//       );
//       /** Call invoke on the agent */
//       const res = await executor.invoke({
//         input: messageContent,
//       });
    
//       console.log("RESPONSE:", res)
      
//     return res
// }
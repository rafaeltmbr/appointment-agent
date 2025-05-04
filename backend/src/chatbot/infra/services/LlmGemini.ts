import { Conversation } from "../../core/entities/Conversation";
import {
  Message,
  ModelMessage,
  ToolCallMessage,
  ToolResponseMessage,
  UserMessage,
} from "../../core/entities/Message";
import { Tool } from "../../core/entities/Tool";
import { Llm } from "../../core/services/Llm";

export class LlmGemini implements Llm {
  constructor(private url: string) {}

  async generate(
    system: string,
    conversation: Conversation,
    tools: Tool[]
  ): Promise<Message[]> {
    const content = {
      system_instruction: { parts: { text: system } },
      contents: conversation.messages.map(LlmGemini.formatContentMessage),
      tools: LlmGemini.formatTools(tools),
      generationConfig: { temperature: 0.2 },
    };

    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.error?.message ?? "LLM unexpected error.");
    }

    const toolCalls = (json.candidates?.[0]?.content.parts ?? [])
      .map((contentPart: any) => contentPart.functionCall)
      .filter((toolCall: any) => !!toolCall);

    if (toolCalls.length) {
      return toolCalls.map(
        (toolCall: any) => new ToolCallMessage(toolCall.name, toolCall.args)
      );
    }

    const text = json.candidates?.[0]?.content.parts[0]?.text;
    if (text) {
      return [new ModelMessage(text)];
    }

    throw new Error("Invalid LLM response.");
  }

  private static formatTools(tools: Tool[]): object {
    const functionDeclarations: object[] = [];

    for (const tool of tools) {
      const properties: Record<string, object> = {};

      const required: string[] = [];

      for (const parameter of tool.parameters) {
        properties[parameter.name] = {
          type: "string",
          description: parameter.description,
        };

        if (parameter.isRequired) {
          required.push(parameter.name);
        }
      }

      functionDeclarations.push({
        name: tool.name,
        description: tool.description,
        parameters: {
          type: "object",
          properties,
          required,
        },
      });
    }

    return [{ functionDeclarations }];
  }

  private static formatContentMessage(message: Message): object {
    if (message instanceof UserMessage) {
      return {
        role: "user",
        parts: [{ text: message.text }],
      };
    }

    if (message instanceof ModelMessage) {
      return {
        role: "model",
        parts: [{ text: message.text }],
      };
    }

    if (message instanceof ToolCallMessage) {
      return {
        role: "model",
        parts: [
          {
            functionCall: {
              name: message.name,
              args: message.parameters,
            },
          },
        ],
      };
    }

    if (message instanceof ToolResponseMessage) {
      return {
        role: "user",
        parts: [
          {
            functionResponse: {
              name: message.name,
              response: {
                text: message.text,
              },
            },
          },
        ],
      };
    }

    throw new Error("Unsupported message.");
  }
}

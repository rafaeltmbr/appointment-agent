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
  ): Promise<Message> {
    const content = {
      system_instruction: {
        parts: {
          text: system,
        },
      },
      contents: conversation.messages.map(LlmGemini.formatContentMessage),
      tools: LlmGemini.formatTools(tools),
    };

    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    const json = await response.json();

    const toolCall =
      json.candidates?.[0]?.content.parts[0]?.functionCall ||
      json.candidates?.[0]?.content.parts[1]?.functionCall;

    if (toolCall) {
      return new ToolCallMessage(toolCall.name, toolCall.args);
    }

    const text = json.candidates?.[0]?.content.parts[0]?.text;
    if (text) {
      return new ModelMessage(text);
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

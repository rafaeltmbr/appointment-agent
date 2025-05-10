import { Id } from "../../../shared/core/entities/Id";
import { Conversation } from "../../core/entities/Conversation";
import {
  Message,
  ModelMessage,
  ToolCallMessage,
  ToolResponseMessage,
  UserMessage,
} from "../../core/entities/Message";
import { Tool } from "../../core/entities/Tool";
import { Llm, LlmOutput, LlmUsage } from "../../core/services/Llm";

export class LlmChatGpt implements Llm {
  constructor(
    private url: string,
    private apiKey: string,
    private model: string
  ) {}

  async generate(
    system: string,
    conversation: Conversation,
    tools: Tool[]
  ): Promise<LlmOutput> {
    const content = {
      model: this.model,
      input: [
        { role: "system", content: system },
        ...LlmChatGpt.formatContentMessage(conversation.messages),
      ],
      tools: LlmChatGpt.formatTools(tools),
    };

    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(content),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.error?.message ?? "LLM unexpected error.");
    }

    const usage: LlmUsage = {
      inputTokens: json.usage?.input_tokens ?? 0,
      outputTokens: json.usage?.output_tokens ?? 0,
    };

    const toolCalls = (json.output ?? []).filter(
      (part: any) => part?.type === "function_call"
    );

    if (toolCalls.length) {
      return {
        messages: toolCalls.map(
          (toolCall: any) =>
            new ToolCallMessage(
              new Id(),
              toolCall.name,
              JSON.parse(toolCall.arguments)
            )
        ),
        usage,
      };
    }

    const textOutput = (json.output ?? []).find(
      (e: any) => !!e?.content?.[0].text
    );
    if (textOutput) {
      return {
        messages: [new ModelMessage(textOutput.content[0].text)],
        usage,
      };
    }

    throw new Error("Invalid LLM response.");
  }

  private static formatTools(tools: Tool[]): object[] {
    const toolDeclarations: object[] = [];

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

      toolDeclarations.push({
        type: "function",
        name: tool.name,
        description: tool.description,
        parameters: {
          type: "object",
          properties,
          required,
          additionalProperties: false,
        },
      });
    }

    return toolDeclarations;
  }

  private static formatContentMessage(messages: Message[]): object[] {
    const formattedMessages: object[] = [];

    for (const message of messages) {
      if (message instanceof UserMessage) {
        formattedMessages.push({
          role: "user",
          content: message.text,
        });
      } else if (message instanceof ModelMessage) {
        formattedMessages.push({
          role: "assistant",
          content: message.text,
        });
      } else if (message instanceof ToolCallMessage) {
        formattedMessages.push({
          type: "function_call",
          status: "completed",
          name: message.name,
          arguments: JSON.stringify(message.parameters),
          call_id: message.callId.value,
        });
      } else if (message instanceof ToolResponseMessage) {
        formattedMessages.push({
          type: "function_call_output",
          output: message.text,
          call_id: message.callId.value,
        });
      } else {
        throw new Error("Unsupported message.");
      }
    }

    return formattedMessages;
  }
}

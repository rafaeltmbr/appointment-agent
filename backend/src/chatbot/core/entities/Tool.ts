interface ToolParameter {
  name: string;
  description: string;
  isRequired: boolean;
}

export class Tool {
  private _name: string;
  private _description: string;
  private _parameters: ToolParameter[];

  constructor(
    name: string,
    description: string,
    parameters: ToolParameter[] = []
  ) {
    this._name = name;
    this._description = description;
    this._parameters = parameters;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get parameters(): ToolParameter[] {
    return this._parameters;
  }

  async execute(parameters: Record<string, string>): Promise<string> {
    throw new Error("Function execution not implemented.");
  }
}

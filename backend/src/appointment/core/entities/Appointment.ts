import { DomainError } from "../../../shared/core/entities/DomainError";
import { Id } from "../../../shared/core/entities/Id";

export class ClientName {
  private _value: string;

  constructor(value: string) {
    this._value = value.toUpperCase().trim();

    this.validate();
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  private validate() {
    if (this._value.length < 3) {
      throw new DomainError(
        "invalid_value",
        "ClientName should be at least 3 characters long."
      );
    }
  }
}

export class ClientGovernmentId {
  private _value: string;

  constructor(value: string) {
    this._value = value;

    this.validate();
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  validate() {
    const regex = /^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/;
    if (!this._value.match(regex)) {
      throw new DomainError(
        "invalid_value",
        "Invalid GovernmentId (CPF) value."
      );
    }
  }
}

export class Client {
  private _name: ClientName;
  private _governmentId: ClientGovernmentId;

  constructor(name: ClientName, governamentId: ClientGovernmentId) {
    this._name = name;
    this._governmentId = governamentId;
  }

  get name(): string {
    return this._name.value;
  }

  get governmentId(): string {
    return this._governmentId.value;
  }

  toString(): string {
    return `Client(name=${this._name}, governmentId=${this._governmentId})`;
  }
}

export class Appointment {
  private _id: Id;
  private _date: Date;
  private _client: Client;

  constructor(id: Id, date: Date, client: Client) {
    this._id = id;
    this._date = date;
    this._client = client;
  }

  get id(): string {
    return this._id.value;
  }

  get date(): string {
    return this._date.toISOString();
  }

  get clientName(): string {
    return this._client.name;
  }

  get clientGovernmentId(): string {
    return this._client.governmentId;
  }

  toString(): string {
    return `Appointment(id='${
      this._id
    }', date='${this._date.toISOString()}', clientName='${
      this._client.name
    }', clientGovernmentId='${this._client.governmentId}')`;
  }
}

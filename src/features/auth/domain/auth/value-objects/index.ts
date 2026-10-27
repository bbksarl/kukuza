import { emailSchema } from '../schemas';

export class Email {
  private readonly value: string;
  constructor(value: string) {
    this.value = emailSchema.parse(value);
    Object.freeze(this);
  }
  equals(other: unknown): boolean { return other instanceof Email && this.value === other.value; }
  toString(): string { return this.value; }
}

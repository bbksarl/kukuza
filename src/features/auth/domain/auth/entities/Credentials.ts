import { loginInputSchema } from '../schemas';

/** La politique de création du mot de passe ne doit pas bloquer une connexion existante. */
export class Credentials {
  readonly username: string;
  readonly password: string;

  constructor(username: string, password: string) {
    const parsed = loginInputSchema.parse({ username, password });
    this.username = parsed.username;
    this.password = parsed.password;
    Object.freeze(this);
  }

  toJSON(): Record<string, string> {
    return { username: this.username, password: this.password };
  }
}

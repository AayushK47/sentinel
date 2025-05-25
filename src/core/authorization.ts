import { sign, verify } from "jsonwebtoken";
import { AuthConfig } from "@sentinel/types";

export class Authorization<TPayload extends object> {
  private config: AuthConfig

  constructor(config: AuthConfig) {
    this.config = config;
  }

  public generateToken(payload: TPayload): string {
    return sign(
      payload, 
      this.config.jwtSecret, 
      { 
        expiresIn: Math.floor(this.config.jwtExpiration * 60)
      }
    );
  }

  public verifyToken(token: string): TPayload {
    try {
      return verify(token, this.config.jwtSecret) as TPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
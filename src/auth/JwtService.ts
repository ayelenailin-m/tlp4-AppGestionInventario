// Responsabilidad: firmar y verificar JWT.
// Se aísla en una clase para poder mockearla en tests o cambiar la lib sin tocar los servicios.
import jwt from "jsonwebtoken";
import { Env } from "../config/env.js";

export type Rol = "admin" | "usuario";
export type JwtPayload = { id: number; rol: Rol };

export class JwtService {
  firmar(payload: JwtPayload): string {
    return jwt.sign(payload, Env.JWT_SECRET, { expiresIn: Env.JWT_EXPIRES });
  }
  verificar(token: string): JwtPayload {
    return jwt.verify(token, Env.JWT_SECRET) as JwtPayload;
  }
}

// Middleware de autenticación por Bearer JWT
// No hace lógica de negocio; solo autentica y adjunta el usuario al request.

import type { NextFunction, Request, Response } from "express";
import { JwtService } from "./JwtService";
import { HttpResponder } from "../core/HttpResponder";

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number; rol: "admin" | "usuario" };
    }
  }
}

export class AuthMiddleware {
  constructor(private jwt: JwtService, private http = new HttpResponder()) {}

  requiereAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.header("Authorization");
    if (!auth?.startsWith("Bearer "))
      return this.http.fail(res, 401, "Token requerido");

    try {
      const token = auth.substring(7);
      req.usuario = this.jwt.verificar(token);
      next();
    } catch {
      return this.http.fail(res, 401, "Token inválido o expirado");
    }
  };
}

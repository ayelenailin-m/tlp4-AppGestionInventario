// Guard simple por rol. Reutilizable en rutas críticas.
import type { NextFunction, Request, Response } from "express";
import { HttpResponder } from "../core/HttpResponder";
import type { Rol } from "./JwtService";

export class RoleGuard {
  constructor(private http = new HttpResponder()) {}
  requiereRol(rol: Rol) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.usuario) return this.http.fail(res, 401, "No autenticado");
      if (req.usuario.rol !== rol)
        return this.http.fail(res, 403, "Sin permiso");
      next();
    };
  }
}

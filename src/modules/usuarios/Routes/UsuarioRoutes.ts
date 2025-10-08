// emsambla el controlador + service

import { Router } from "express";
import { UsuarioRepo } from "../Repo/UsuarioRepo";
import { UsuarioService } from "../Service/UsuarioService";
import { UsuarioController } from "../Controller/UsuarioController";
import { JwtService } from "../../../auth/JwtService";
import { RoleGuard } from "../../../auth/RoleGuard";
import { AuthMiddleware } from "../../../auth/AuthMiddleware";

export class UsuarioRoutes {
  public readonly router: Router;

  constructor() {
    const jwt = new JwtService();
    const auth = new AuthMiddleware(jwt);
    const guard = new RoleGuard();
    const repo = new UsuarioRepo();
    const service = new UsuarioService(repo, jwt);
    const controller = new UsuarioController(service);

    this.router = Router();
    this.router.post("/auth/primer-admin", controller.primerAdmin);
    this.router.post(
      "/auth/registro",
      auth.requiereAuth,
      guard.requiereRol("admin"),
      controller.registrar
    );
    this.router.post("/auth/login", controller.login);
  }
}

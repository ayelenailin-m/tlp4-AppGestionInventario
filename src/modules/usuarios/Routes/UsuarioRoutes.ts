// emsambla el controlador + service

import { Router } from "express";
import { UsuarioRepo } from "../Repo/UsuarioRepo.js";
import { UsuarioService } from "../Service/UsuarioService.js";
import { UsuarioController } from "../Controller/UsuarioController.js";
import { JwtService } from "../../../auth/JwtService.js";

export class UsuarioRoutes {
  public readonly router: Router;

  constructor() {
    const jwt = new JwtService();
    const repo = new UsuarioRepo();
    const service = new UsuarioService(repo, jwt);
    const controller = new UsuarioController(service);

    this.router = Router();
    this.router.post("/auth/registro", controller.registrar);
    this.router.post("/auth/login", controller.login);
  }
}

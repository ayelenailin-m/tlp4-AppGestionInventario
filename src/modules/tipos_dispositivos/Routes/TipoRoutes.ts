import { Router } from "express";
import { TipoRepo } from "../Repo/TipoRepo.js";
import { TipoService } from "../Service/TipoService.js";
import { TipoController } from "../Controller/TipoController.js";
import { AuthMiddleware } from "../../../auth/AuthMiddleware.js";
import { JwtService } from "../../../auth/JwtService.js";
import { RoleGuard } from "../../../auth/RoleGuard.js";

export class TipoRoutes {
  public readonly router: Router;

  constructor() {
    const repo = new TipoRepo();
    const service = new TipoService(repo);
    const controller = new TipoController(service);

    const jwt = new JwtService();
    const auth = new AuthMiddleware(jwt);
    const guard = new RoleGuard();

    this.router = Router();
    this.router.get("/tipos", auth.requiereAuth, controller.listar);
    this.router.post(
      "/tipos",
      auth.requiereAuth,
      guard.requiereRol("admin"),
      controller.crear
    );
  }
}

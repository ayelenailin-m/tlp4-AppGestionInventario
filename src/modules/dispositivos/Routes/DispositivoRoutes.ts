import { Router } from "express";
import { DispositivoRepo } from "../Repo/DispositivoRepo.js";
import { DispositivoService } from "../Service/DispositivoService.js";
import { DispositivoController } from "../Controller/DispositivoController.js";
import { AuthMiddleware } from "../../../auth/AuthMiddleware.js";
import { JwtService } from "../../../auth/JwtService.js";
import { RoleGuard } from "../../../auth/RoleGuard.js";

export class DispositivoRoutes {
  public readonly router: Router;

  constructor() {
    const repo = new DispositivoRepo();
    const service = new DispositivoService(repo);
    const controller = new DispositivoController(service);

    const jwt = new JwtService();
    const auth = new AuthMiddleware(jwt);
    const guard = new RoleGuard();

    this.router = Router();
    this.router.get("/dispositivos", auth.requiereAuth, controller.listar);
    this.router.post(
      "/dispositivos",
      auth.requiereAuth,
      guard.requiereRol("admin"),
      controller.crear
    );
  }
}

import { Router } from "express";
import { AsignacionService } from "../Service/AsignacionService.js";
import { AsignacionController } from "../Controller/AsignacionController.js";
import { AsignacionRepo } from "../Repo/AsignacionRepo.js";
import { DispositivoRepo } from "../../dispositivos/Repo/DispositivoRepo.js";
import { AuthMiddleware } from "../../../auth/AuthMiddleware.js";
import { JwtService } from "../../../auth/JwtService.js";
import { RoleGuard } from "../../../auth/RoleGuard.js";

export class AsignacionRoutes {
  public readonly router: Router;

  constructor() {
    const asigRepo = new AsignacionRepo();
    const dispRepo = new DispositivoRepo();
    const service = new AsignacionService(asigRepo, dispRepo);
    const controller = new AsignacionController(service);

    const jwt = new JwtService();
    const auth = new AuthMiddleware(jwt);
    const guard = new RoleGuard();

    this.router = Router();
    this.router.post(
      "/asignaciones/:dispositivoId/asignar",
      auth.requiereAuth,
      guard.requiereRol("admin"),
      controller.asignar
    );
    this.router.post(
      "/asignaciones/:dispositivoId/devolver",
      auth.requiereAuth,
      guard.requiereRol("admin"),
      controller.devolver
    );
  }
}

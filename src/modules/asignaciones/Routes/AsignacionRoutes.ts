import { Router } from "express";
import { AsignacionService } from "../Service/AsignacionService";
import { AsignacionController } from "../Controller/AsignacionController";
import { AsignacionRepo } from "../Repo/AsignacionRepo";
import { DispositivoRepo } from "../../dispositivos/Repo/DispositivoRepo";
import { AuthMiddleware } from "../../../auth/AuthMiddleware";
import { JwtService } from "../../../auth/JwtService";
import { RoleGuard } from "../../../auth/RoleGuard";

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

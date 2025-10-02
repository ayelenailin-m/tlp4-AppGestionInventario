import { Router } from "express";
import { UbicacionService } from "../Service/UbicacionService.js";
import { UbicacionController } from "../Controller/UbicacionController.js";
import { AuthMiddleware } from "../../../auth/AuthMiddleware.js";
import { JwtService } from "../../../auth/JwtService.js";
import { RoleGuard } from "../../../auth/RoleGuard.js";
import { UbicacionRepo } from "../Repo/UbicacionRepo.js";

export class UbicacionRoutes {
  public readonly router: Router;

  constructor() {
    const repo = new UbicacionRepo();
    const service = new UbicacionService(repo);
    const controller = new UbicacionController(service);

    const jwt = new JwtService();
    const auth = new AuthMiddleware(jwt);
    const guard = new RoleGuard();

    this.router = Router();
    this.router.get("/ubicaciones", auth.requiereAuth, controller.listar);
    this.router.post(
      "/ubicaciones",
      auth.requiereAuth,
      guard.requiereRol("admin"),
      controller.crear
    );
  }
}

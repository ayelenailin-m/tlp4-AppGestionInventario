import { Router } from "express";
import { UbicacionService } from "../Service/UbicacionService";
import { UbicacionController } from "../Controller/UbicacionController";
import { AuthMiddleware } from "../../../auth/AuthMiddleware";
import { JwtService } from "../../../auth/JwtService";
import { RoleGuard } from "../../../auth/RoleGuard";
import { UbicacionRepo } from "../Repo/UbicacionRepo";

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

import { Router } from "express";
import { TipoRepo } from "../Repo/TipoRepo";
import { TipoService } from "../Service/TipoService";
import { TipoController } from "../Controller/TipoController";
import { AuthMiddleware } from "../../../auth/AuthMiddleware";
import { JwtService } from "../../../auth/JwtService";
import { RoleGuard } from "../../../auth/RoleGuard";

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

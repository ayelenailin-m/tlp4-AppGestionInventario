import { Router } from "express";
import { DispositivoRepo } from "../Repo/DispositivoRepo";
import { DispositivoService } from "../Service/DispositivoService";
import { DispositivoController } from "../Controller/DispositivoController";
import { AuthMiddleware } from "../../../auth/AuthMiddleware";
import { JwtService } from "../../../auth/JwtService";
import { RoleGuard } from "../../../auth/RoleGuard";

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

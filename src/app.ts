import express from "express";
import cors from "cors";
import morgan from "morgan";
import { HttpResponder } from "./core/HttpResponder";
import { ErrorMapper } from "./core/Errors";

// modulos
import { UsuarioRoutes } from "./modules/usuarios/Routes/UsuarioRoutes";
import { TipoRoutes } from "./modules/tipos_dispositivos/Routes/TipoRoutes";
import { DispositivoRoutes } from "./modules/dispositivos/Routes/DispositivoRoutes";
import { UbicacionRoutes } from "./modules/ubicaciones/Routes/UbicacionRoutes";
import { AsignacionRoutes } from "./modules/asignaciones/Routes/AsignacionRoutes";

export class App {
  private app = express();
  private http = new HttpResponder();

  constructor() {
    this.configure();
    this.routes();
    this.handleNotFound();
    this.handleErrors();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan("dev"));
  }

  private routes() {
    const usuarios = new UsuarioRoutes();
    const tipos = new TipoRoutes();
    const dispositivos = new DispositivoRoutes();
    const ubicaciones = new UbicacionRoutes();
    const asignaciones = new AsignacionRoutes();

    this.app.get("/api/salud", (_req, res) =>
      this.http.ok(res, { status: "ok" })
    );

    this.app.use("/api", usuarios.router);
    this.app.use("/api", tipos.router);
    this.app.use("/api", dispositivos.router);
    this.app.use("/api", ubicaciones.router);
    this.app.use("/api", asignaciones.router);
  }

  private handleNotFound() {
    this.app.use((_req, res) => this.http.fail(res, 404, "Ruta no encontrada"));
  }

  private handleErrors() {
    this.app.use((err: any, _req: any, res: any, _next: any) => {
      console.log("[ERR", err);

      const { code, message } = ErrorMapper.toHttp(err);
      return this.http.fail(res, code, message);
    });
  }

  public getExpressInstance() {
    return this.app;
  }
}

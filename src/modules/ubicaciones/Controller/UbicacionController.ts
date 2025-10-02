import type { Request, Response } from "express";
import { UbicacionService } from "../Service/UbicacionService.js";
import { HttpResponder } from "../../../core/HttpResponder.js";

export class UbicacionController {
  constructor(
    private service: UbicacionService,
    private http = new HttpResponder()
  ) {}

  listar = async (_req: Request, res: Response) => {
    const data = await this.service.listar();
    return this.http.ok(res, data);
  };

  crear = async (req: Request, res: Response) => {
    const data = await this.service.crear({
      nombre: req.body?.nombre,
      area: req.body?.area,
    });
    return this.http.created(res, data);
  };
}

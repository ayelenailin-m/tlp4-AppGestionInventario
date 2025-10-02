import type { Request, Response } from "express";
import { TipoService } from "../Service/TipoService.js";
import { HttpResponder } from "../../../core/HttpResponder.js";

export class TipoController {
  constructor(
    private service: TipoService,
    private http = new HttpResponder()
  ) {}

  listar = async (_req: Request, res: Response) => {
    const data = await this.service.listar();
    return this.http.ok(res, data);
  };

  crear = async (req: Request, res: Response) => {
    const data = await this.service.crear({ nombre: req.body?.nombre });
    return this.http.created(res, data);
  };
}

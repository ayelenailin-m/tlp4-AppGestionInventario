import type { Request, Response } from "express";
import { DispositivoService } from "../Service/DispositivoService.js";
import { HttpResponder } from "../../../core/HttpResponder.js";
import { ValidationError } from "../../../core/Errors.js";

export class DispositivoController {
  constructor(
    private service: DispositivoService,
    private http = new HttpResponder()
  ) {}

  listar = async (_req: Request, res: Response) => {
    const data = await this.service.listar();
    return this.http.ok(res, data);
  };

  crear = async (req: Request, res: Response) => {
    const { codigo_inventario, numero_serie, marca, modelo, tipo_id } =
      req.body ?? {};
    if (!codigo_inventario || !numero_serie || !tipo_id)
      throw new ValidationError("Faltan datos");
    const data = await this.service.crear({
      codigo_inventario,
      numero_serie,
      marca,
      modelo,
      tipo_id: Number(tipo_id),
    });
    return this.http.created(res, data);
  };
}

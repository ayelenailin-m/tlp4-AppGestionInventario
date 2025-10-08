import type { Request, Response } from "express";
import { AsignacionService } from "../Service/AsignacionService.js";
import { HttpResponder } from "../../../core/HttpResponder.js";
import { ValidationError } from "../../../core/Errors.js";

export class AsignacionController {
  constructor(
    private service: AsignacionService,
    private http = new HttpResponder()
  ) {}

  asignar = async (req: Request, res: Response) => {
    const dispositivoId = Number(req.params.dispositivoId);
    const { usuarioId, ubicacionId } = req.body ?? {};
    if (!usuarioId || !ubicacionId || !dispositivoId)
      throw new ValidationError("Datos insuficientes");
    const data = await this.service.asignar({
      usuarioId: Number(usuarioId),
      dispositivoId,
      ubicacionId: Number(ubicacionId),
    });
    return this.http.created(res, data);
  };

  devolver = async (req: Request, res: Response) => {
    const dispositivoId = Number(req.params.dispositivoId);
    if (!dispositivoId) throw new ValidationError("dispositivoId inválido");
    const data = await this.service.devolver({ dispositivoId });
    return this.http.ok(res, data);
  };
}

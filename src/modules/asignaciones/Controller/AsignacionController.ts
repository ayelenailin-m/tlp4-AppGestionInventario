import type { Request, Response } from "express";
import { AsignacionService } from "../Service/AsignacionService";
import { HttpResponder } from "../../../core/HttpResponder";
import { ValidationError } from "../../../core/Errors";

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

  listarAbiertas = async (_req: Request, res: Response) => {
    const data = await this.service.listarAbiertas();
    return this.http.ok(res, data);
  };

  listarHistorial = async (req: Request, res: Response) => {
    const usuarioId = req.query.usuarioId
      ? Number(req.query.usuarioId)
      : undefined;
    const dispositivoId = req.query.dispositivoId
      ? Number(req.query.dispositivoId)
      : undefined;
    const data = await this.service.listarHistorial({
      usuarioId,
      dispositivoId,
    });
    return this.http.ok(res, data);
  };
}

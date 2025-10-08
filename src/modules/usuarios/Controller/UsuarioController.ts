// acá se orquesta la entrada y salida de la petición, y delega la lógica al servicio
// valida lo minimo necesario

import type { Request, Response } from "express";
import { UsuarioService } from "../Service/UsuarioService";
import { HttpResponder } from "../../../core/HttpResponder";
import { ValidationError } from "../../../core/Errors";

export class UsuarioController {
  constructor(
    private service: UsuarioService,
    private http = new HttpResponder()
  ) {}

  registrar = async (req: Request, res: Response) => {
    const { nombre, correo, contrasenia, rol } = req.body ?? {};
    if (!nombre || !correo || !contrasenia)
      throw new ValidationError("Faltan datos");
    const data = await this.service.registrar({
      nombre,
      correo,
      contrasenia,
      rol,
    });
    return this.http.created(res, data);
  };

  login = async (req: Request, res: Response) => {
    const { correo, contrasenia } = req.body ?? {};
    if (!correo || !contrasenia) throw new ValidationError("Faltan datos");
    const data = await this.service.login({ correo, contrasenia });
    return this.http.ok(res, data);
  };
}

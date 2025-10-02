import type { IUsuarioRepo } from "./IUsuarioRepo.js";
import type { Usuario } from "../Model/Usuario.model.js";
import { Database } from "../../../db/Database.js";

export class UsuarioRepo implements IUsuarioRepo {
  private db = Database.getInstance();

  async buscarPorCorreo(correo: string): Promise<Usuario | undefined> {
    const [rows] = await this.db.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );
    const data = rows as any[];
    return data[0] as Usuario | undefined;
  }

  async crear(
    nombre: string,
    correo: string,
    hash: string,
    rol: "admin" | "usuario"
  ): Promise<number> {
    const [result]: any = await this.db.query(
      "INSERT INTO usuarios (nombre, correo, contrasenia_hash, rol, activo) VALUES (?, ?, ?, ?, 1)",
      [nombre, correo, hash, rol]
    );
    return result.insertId as number;
  }
}

import type { IUsuarioRepo } from "./IUsuarioRepo";
import type { Usuario } from "../Model/Usuario.model";
import { Database } from "../../../db/Database";

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

  async contarTodos(): Promise<number> {
    const [rows] = await this.db.query(
      "SELECT COUNT(*) AS total FROM usuarios"
    );
    const data = rows as Array<{ total: number }>;
    return data[0]?.total ?? 0;
  }
}

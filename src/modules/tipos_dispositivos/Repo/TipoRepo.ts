import { Database } from "../../../db/Database.js";
import type { Tipo } from "../Model/Tipo.model.js";

export class TipoRepo {
  private db = Database.getInstance();

  async listar(): Promise<Tipo[]> {
    const [rows] = await this.db.query(
      "SELECT id, nombre FROM tipos_dispositivos ORDER BY nombre"
    );
    return rows as Tipo[];
  }

  async crear(nombre: string): Promise<number> {
    const [r]: any = await this.db.query(
      "INSERT INTO tipos_dispositivos (nombre) VALUES (?)",
      [nombre]
    );
    return r.insertId as number;
  }
}

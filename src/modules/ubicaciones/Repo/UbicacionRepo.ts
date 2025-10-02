import { Database } from "../../../db/Database.js";
import type { Ubicacion } from "../Model/Ubicacion.model.js";

export class UbicacionRepo {
  private db = Database.getInstance();

  async listar(): Promise<Ubicacion[]> {
    const [rows] = await this.db.query(
      "SELECT id, nombre, area FROM ubicaciones ORDER BY nombre"
    );
    return rows as Ubicacion[];
  }

  async crear(nombre: string, area?: string): Promise<number> {
    const [r]: any = await this.db.query(
      "INSERT INTO ubicaciones (nombre, area) VALUES (?, ?)",
      [nombre, area ?? null]
    );
    return r.insertId as number;
  }
}

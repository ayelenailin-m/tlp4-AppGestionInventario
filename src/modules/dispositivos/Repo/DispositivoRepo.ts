import { Database } from "../../../db/Database.js";
import type { Dispositivo } from "../Model/Dispositivo.model.js";

export class DispositivoRepo {
  private db = Database.getInstance();

  async listar(): Promise<Dispositivo[]> {
    const [rows] = await this.db.query(
      "SELECT * FROM dispositivos ORDER BY id DESC"
    );
    return rows as Dispositivo[];
  }

  async buscarPorId(id: number): Promise<Dispositivo | undefined> {
    const [rows] = await this.db.query(
      "SELECT * FROM dispositivos WHERE id=?",
      [id]
    );
    const data = rows as any[];
    return data[0] as Dispositivo | undefined;
  }

  async crear(dto: {
    codigo_inventario: string;
    numero_serie: string;
    marca?: string;
    modelo?: string;
    tipo_id: number;
  }): Promise<number> {
    const [r]: any = await this.db.query(
      "INSERT INTO dispositivos (codigo_inventario, numero_serie, marca, modelo, tipo_id) VALUES (?, ?, ?, ?, ?)",
      [
        dto.codigo_inventario,
        dto.numero_serie,
        dto.marca ?? null,
        dto.modelo ?? null,
        dto.tipo_id,
      ]
    );
    return r.insertId as number;
  }

  async actualizarEstado(id: number, estado: string) {
    await this.db.query("UPDATE dispositivos SET estado=? WHERE id=?", [
      estado,
      id,
    ]);
  }
}

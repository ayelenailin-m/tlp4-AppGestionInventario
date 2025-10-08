// Repositorio con conexión inyectada cuando se usan transacciones.
// De esta forma, varias operaciones comparten el mismo BEGIN/COMMIT.

import type { PoolConnection } from "mysql2/promise";

export class AsignacionRepo {
  async encontrarAbiertaPorDispositivo(
    conn: PoolConnection,
    dispositivoId: number
  ) {
    const [rows] = await conn.query(
      "SELECT * FROM asignaciones WHERE dispositivo_id=? AND fecha_devuelto IS NULL LIMIT 1",
      [dispositivoId]
    );
    const data = rows as any[];
    return data[0] as any | undefined;
  }

  async crear(
    conn: PoolConnection,
    dto: { usuarioId: number; dispositivoId: number; ubicacionId: number }
  ) {
    await conn.query(
      "INSERT INTO asignaciones (usuario_id, dispositivo_id, ubicacion_id, fecha_asignado) VALUES (?, ?, ?, NOW())",
      [dto.usuarioId, dto.dispositivoId, dto.ubicacionId]
    );
  }

  async cerrar(conn: PoolConnection, asignacionId: number) {
    await conn.query(
      "UPDATE asignaciones SET fecha_devuelto = NOW() WHERE id = ?",
      [asignacionId]
    );
  }
}

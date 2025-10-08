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

  async listarAbiertas(conn: PoolConnection) {
    const [rows] = await conn.query(`
      SELECT 
        a.id            AS asignacion_id,
        a.fecha_asignado,
        u.id            AS usuario_id,
        u.nombre        AS usuario_nombre,
        u.correo        AS usuario_correo,
        d.id            AS dispositivo_id,
        d.codigo_inventario,
        d.numero_serie,
        d.marca,
        d.modelo,
        ub.id           AS ubicacion_id,
        ub.nombre       AS ubicacion_nombre,
        ub.area         AS ubicacion_area
      FROM asignaciones a
      JOIN usuarios u     ON u.id = a.usuario_id
      JOIN dispositivos d ON d.id = a.dispositivo_id
      JOIN ubicaciones ub ON ub.id = a.ubicacion_id
      WHERE a.fecha_devuelto IS NULL
      ORDER BY a.fecha_asignado DESC
    `);
    return rows as any[];
  }

  async listarHistorial(
    conn: PoolConnection,
    opts: { usuarioId?: number; dispositivoId?: number } = {}
  ) {
    const filtros: string[] = [];
    const params: any[] = [];
    if (opts.usuarioId) {
      filtros.push("a.usuario_id = ?");
      params.push(opts.usuarioId);
    }
    if (opts.dispositivoId) {
      filtros.push("a.dispositivo_id = ?");
      params.push(opts.dispositivoId);
    }

    const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
    const [rows] = await conn.query(
      `
      SELECT 
        a.id, a.usuario_id, a.dispositivo_id, a.ubicacion_id,
        a.fecha_asignado, a.fecha_devuelto,
        u.nombre  AS usuario_nombre,
        d.codigo_inventario, d.numero_serie,
        ub.nombre AS ubicacion_nombre
      FROM asignaciones a
      JOIN usuarios u     ON u.id = a.usuario_id
      JOIN dispositivos d ON d.id = a.dispositivo_id
      JOIN ubicaciones ub ON ub.id = a.ubicacion_id
      ${where}
      ORDER BY a.fecha_asignado DESC
    `,
      params
    );
    return rows as any[];
  }
}

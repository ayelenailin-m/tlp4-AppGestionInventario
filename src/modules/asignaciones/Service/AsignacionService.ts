// Reglas de negocio de asignar/devolver. Usa transacciones para garantizar invariantes.

import { Database } from "../../../db/Database";
import { DispositivoRepo } from "../../dispositivos/Repo/DispositivoRepo";
import { AsignacionRepo } from "../Repo/AsignacionRepo";
import type {
  CrearAsignacionDTO,
  DevolverAsignacionDTO,
} from "../Model/Asignacion.model";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../core/Errors";
export class AsignacionService {
  constructor(
    private asigRepo: AsignacionRepo,
    private dispRepo: DispositivoRepo
  ) {}

  async asignar(dto: CrearAsignacionDTO) {
    if (!dto.usuarioId || !dto.dispositivoId || !dto.ubicacionId) {
      throw new ValidationError(
        "usuarioId, dispositivoId y ubicacionId son obligatorios"
      );
    }

    const db = Database.getInstance();
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const disp = await this.dispRepo.buscarPorId(dto.dispositivoId);
      if (!disp) throw new NotFoundError("Dispositivo no existe");

      const abierta = await this.asigRepo.encontrarAbiertaPorDispositivo(
        conn,
        dto.dispositivoId
      );
      if (abierta) throw new ConflictError("El dispositivo ya está asignado");

      await this.asigRepo.crear(conn, dto);
      await conn.query('UPDATE dispositivos SET estado="asignado" WHERE id=?', [
        dto.dispositivoId,
      ]);

      await conn.commit();
      return {
        ok: true,
        dispositivoId: dto.dispositivoId,
        usuarioId: dto.usuarioId,
        ubicacionId: dto.ubicacionId,
      };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async devolver(dto: DevolverAsignacionDTO) {
    if (!dto.dispositivoId)
      throw new ValidationError("dispositivoId es obligatorio");

    const db = Database.getInstance();
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const abierta = await this.asigRepo.encontrarAbiertaPorDispositivo(
        conn,
        dto.dispositivoId
      );
      if (!abierta)
        throw new ConflictError(
          "No hay asignación abierta para este dispositivo"
        );

      await this.asigRepo.cerrar(conn, abierta.id);
      await conn.query(
        'UPDATE dispositivos SET estado="disponible" WHERE id=?',
        [dto.dispositivoId]
      );

      await conn.commit();
      return {
        ok: true,
        asignacionId: abierta.id,
        dispositivoId: dto.dispositivoId,
      };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }
}

import { DispositivoRepo } from "../Repo/DispositivoRepo.js";
import type { CrearDispositivoDTO } from "../Model/Dispositivo.model.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../core/Errors.js";

export class DispositivoService {
  constructor(private repo: DispositivoRepo) {}

  async listar() {
    return this.repo.listar();
  }

  async crear(dto: CrearDispositivoDTO) {
    if (!dto.codigo_inventario || !dto.numero_serie || !dto.tipo_id) {
      throw new ValidationError("Faltan campos obligatorios");
    }
    try {
      const id = await this.repo.crear(dto);
      return { id, ...dto, estado: "disponible" as const };
    } catch {
      throw new ConflictError(
        "Código de inventario o número de serie ya existentes"
      );
    }
  }

  async asegurarExiste(id: number) {
    const d = await this.repo.buscarPorId(id);
    if (!d) throw new NotFoundError("Dispositivo no existe");
    return d;
  }
}

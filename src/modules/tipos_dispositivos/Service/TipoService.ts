import type { CrearTipoDTO } from "../Model/Tipo.model";
import { TipoRepo } from "../Repo/TipoRepo";
import { ConflictError, ValidationError } from "../../../core/Errors";

export class TipoService {
  constructor(private repo: TipoRepo) {}

  async listar() {
    return this.repo.listar();
  }

  async crear(dto: CrearTipoDTO) {
    if (!dto.nombre?.trim()) throw new ValidationError("Nombre requerido");
    try {
      const id = await this.repo.crear(dto.nombre.trim());
      return { id, nombre: dto.nombre.trim() };
    } catch {
      throw new ConflictError("El nombre ya existe");
    }
  }
}

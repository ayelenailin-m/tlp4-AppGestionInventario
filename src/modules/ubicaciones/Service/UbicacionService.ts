import { UbicacionRepo } from "../Repo/UbicacionRepo";
import type { CrearUbicacionDTO } from "../Model/Ubicacion.model";
import { ConflictError, ValidationError } from "../../../core/Errors";

export class UbicacionService {
  constructor(private repo: UbicacionRepo) {}

  async listar() {
    return this.repo.listar();
  }

  async crear(dto: CrearUbicacionDTO) {
    if (!dto.nombre?.trim()) throw new ValidationError("Nombre requerido");
    try {
      const id = await this.repo.crear(dto.nombre.trim(), dto.area?.trim());
      return { id, ...dto };
    } catch {
      throw new ConflictError("La ubicación ya existe");
    }
  }
}

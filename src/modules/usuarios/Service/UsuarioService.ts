// acá se aplicaría la lógica de negocio, acá ni se entera de http ni de expres ni de nada

import bcrypt from "bcrypt";
import type { IUsuarioRepo } from "../Repo/IUsuarioRepo";
import type { RegistroDTO, LoginDTO } from "../Model/Usuario.model";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../core/Errors";
import { JwtService } from "../../../auth/JwtService";

export class UsuarioService {
  constructor(private repo: IUsuarioRepo, private jwt: JwtService) {}

  async registrar(dto: RegistroDTO) {
    const existente = await this.repo.buscarPorCorreo(dto.correo);
    if (existente) throw new ConflictError("El correo ya está registrado");

    const hash = await bcrypt.hash(dto.contrasenia, 10);
    const id = await this.repo.crear(
      dto.nombre,
      dto.correo,
      hash,
      dto.rol ?? "usuario"
    );
    const token = this.jwt.firmar({ id, rol: dto.rol ?? "usuario" });
    return {
      id,
      nombre: dto.nombre,
      correo: dto.correo,
      rol: dto.rol ?? "usuario",
      token,
    };
  }

  async login(dto: LoginDTO) {
    const u = await this.repo.buscarPorCorreo(dto.correo);
    if (!u || !u.activo)
      throw new NotFoundError("Usuario no encontrado o inactivo");

    const ok = await bcrypt.compare(dto.contrasenia, u.contrasenia_hash);
    if (!ok) throw new NotFoundError("Credenciales inválidas");

    const token = this.jwt.firmar({ id: u.id, rol: u.rol });
    return { id: u.id, nombre: u.nombre, correo: u.correo, rol: u.rol, token };
  }

  async primerAdmin(dto: RegistroDTO) {
    if (!dto.nombre || !dto.correo || !dto.contrasenia) {
      throw new ValidationError("Faltan nombre, correo o contraseña");
    }

    const total = await this.repo.contarTodos();
    if (total > 0) {
      // Si ya hay usuarios, no se permite usar esta ruta
      throw new ConflictError("Ya existe al menos un usuario registrado");
    }

    const hash = await bcrypt.hash(dto.contrasenia, 10);
    // Fuerza rol admin para el primer usuario
    const id = await this.repo.crear(dto.nombre, dto.correo, hash, "admin");
    const token = this.jwt.firmar({ id, rol: "admin" });

    return { id, nombre: dto.nombre, correo: dto.correo, rol: "admin", token };
  }
}

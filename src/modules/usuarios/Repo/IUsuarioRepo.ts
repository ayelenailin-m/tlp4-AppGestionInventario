// interfaz que describe lo que el servicio necesita del repo - /
//va a permitir intercambiar de gestor de base de datos si se requiere en el futuro
// y solo habría que cambiar los repos

import type { Usuario } from "../Model/Usuario.model.js";

export interface IUsuarioRepo {
  buscarPorCorreo(correo: string): Promise<Usuario | undefined>;

  crear(
    nombre: string,
    correo: string,
    contrasenia_hash: string,
    rol: "admin" | "usuario"
  ): Promise<number>;
}

export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  contrasenia_hash: string;
  rol: "admin" | "usuario";
  activo: 0 | 1;
};

export type RegistroDTO = {
  nombre: string;
  correo: string;
  contrasenia: string;
  rol?: "admin" | "usuario";
};
export type LoginDTO = { correo: string; contrasenia: string };

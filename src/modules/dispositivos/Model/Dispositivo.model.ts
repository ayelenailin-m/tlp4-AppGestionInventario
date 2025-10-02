export type Estado = "disponible" | "asignado" | "en_reparacion" | "retirado";

export type Dispositivo = {
  id: number;
  codigo_inventario: string;
  numero_serie: string;
  marca: string | null;
  modelo: string | null;
  estado: Estado;
  tipo_id: number;
};

export type CrearDispositivoDTO = {
  codigo_inventario: string;
  numero_serie: string;
  marca?: string;
  modelo?: string;
  tipo_id: number;
};

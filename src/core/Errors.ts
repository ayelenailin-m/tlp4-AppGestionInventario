export class DomainError extends Error {
  constructor(m: string) {
    super(m);
    this.name = "DomainError";
  }
}
export class NotFoundError extends DomainError {
  constructor(m = "No encontrado") {
    super(m);
  }
}
export class ConflictError extends DomainError {
  constructor(m = "Conflicto") {
    super(m);
  }
}
export class ValidationError extends DomainError {
  constructor(m = "Datos inválidos") {
    super(m);
  }
}

export class ErrorMapper {
  static toHttp(e: any) {
    // MySQL2 errores comunes
    if (e?.code === "ER_DUP_ENTRY")
      return { code: 409, message: "Dato duplicado" };
    if (
      e?.code === "ER_NO_REFERENCED_ROW_2" ||
      e?.code === "ER_ROW_IS_REFERENCED_2"
    )
      return { code: 400, message: "Referencia inválida" };
    if (e instanceof ValidationError) return { code: 422, message: e.message };
    if (e instanceof NotFoundError) return { code: 404, message: e.message };
    if (e instanceof ConflictError) return { code: 409, message: e.message };
    if (e instanceof DomainError) return { code: 400, message: e.message };
    return { code: 500, message: "Error interno" };
  }
}

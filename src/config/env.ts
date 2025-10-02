import "dotenv/config";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno ${name}`);
  return v;
}

export class Env {
  static readonly PORT = Number(process.env.PORT ?? 3402);
  static readonly DB_HOST = requireEnv("DB_HOST");
  static readonly DB_USER = requireEnv("DB_USER");
  static readonly DB_PASS = process.env.DB_PASS ?? "";
  static readonly DB_NAME = requireEnv("DB_NAME");
  static readonly JWT_SECRET = requireEnv("JWT_SECRET");
  static readonly JWT_EXPIRES = process.env.JWT_EXPIRES ?? "10h";
}

import mysql from "mysql2/promise";
import type {
  Pool,
  PoolConnection,
  RowDataPacket,
  OkPacket,
  ResultSetHeader,
  FieldPacket,
} from "mysql2/promise";
import { Env } from "../config/env.js";

export class Database {
  private static instance: Database;
  private pool!: Pool;

  private constructor() {
    /*privado*/
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.pool = mysql.createPool({
        host: Env.DB_HOST,
        user: Env.DB_USER,
        password: Env.DB_PASS,
        database: Env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        namedPlaceholders: true,
      });
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async getConnection(): Promise<PoolConnection> {
    return this.pool.getConnection();
  }

  public async query<
    T extends
      | RowDataPacket[]
      | RowDataPacket[][]
      | OkPacket
      | OkPacket[]
      | ResultSetHeader
  >(sql: string, params?: any[]): Promise<[T, FieldPacket[]]> {
    return this.pool.query<T>(sql, params);
  }
}

import type { Response } from "express";

export class HttpResponder {
  ok(res: Response, data?: unknown) {
    return res.status(200).json({ ok: true, data });
  }
  created(res: Response, data?: unknown) {
    return res.status(201).json({ ok: true, data });
  }
  fail(res: Response, code: number, message: string, details?: unknown) {
    return res.status(code).json({ ok: false, message, details });
  }
}

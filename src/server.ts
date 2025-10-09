import { App } from "./app";
import { Env } from "./config/env";
import { Database } from "./db/Database";

async function server() {
  await Database.getInstance().query("SELECT 1");
  const app = new App().getExpressInstance();
  app.listen(Env.PORT, () => {
    console.log(`API escuchando en http://localhost:${Env.PORT}`);
  });
}
// hola
server().catch((e) => {
  console.error("Error al iniciar:", e);
  process.exit(1);
});

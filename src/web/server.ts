import express from "express";
import path from "path";
import oauthRoutes from "./routes/oauth.js";
import pagesRoutes from "./routes/pages.js";

const app = express();

app.use(express.static(path.join(process.cwd(), "src/web/public")));

app.use("/oauth", oauthRoutes);
app.use("/", pagesRoutes);

export function startWebServer() {
  app.listen(3000, () => {
    console.log("Serveur web Exolt lancé sur http://localhost:3000");
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startWebServer();
}
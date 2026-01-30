import * as dotenv from "dotenv";
import { saveTokens } from "./token.js";
import { log, LogLevel } from "../utils/logger.js";
import * as http from "http";
import { parse } from "url";

dotenv.config();

const clientId = process.env.BETTERAUTH_CLIENT_ID;
const clientSecret = process.env.BETTERAUTH_CLIENT_SECRET;
const redirectUri = process.env.BETTERAUTH_REDIRECT_URI;

if (!clientId || !clientSecret || !redirectUri) {
  log(
    LogLevel.ERROR,
    "BETTERAUTH_CLIENT_ID, BETTERAUTH_CLIENT_SECRET et BETTERAUTH_REDIRECT_URI requis dans .env",
  );
  process.exit(1);
}

async function exchangeCodeForTokens(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code.trim(),
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri!,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur OAuth: ${error}`);
  }

  return await response.json();
}

async function authenticate() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    {
      client_id: clientId!,
      redirect_uri: redirectUri!,
      response_type: "code",
      scope: "https://mail.google.com/ email",
      access_type: "offline",
      prompt: "consent",
    },
  )}`;

  log(LogLevel.INFO, "Démarrage du serveur local pour l'authentification...");

  const server = http.createServer(async (req, res) => {
    const parsedUrl = parse(req.url || "", true);
    const code = parsedUrl.query.code as string;

    if (!code) {
      res.writeHead(400);
      res.end();
      return;
    }

    res.writeHead(200);
    res.end();

    try {
      log(LogLevel.INFO, "Code reçu");

      const tokens = await exchangeCodeForTokens(code);
      await saveTokens(tokens);

      log(LogLevel.INFO, "Authentification réussie...");
      log(LogLevel.INFO, "Vous pouvez maintenant lancer EXOLT");

      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 500);
    } catch (error) {
      log(LogLevel.ERROR, "Erreur lors de l'authentification:", error);
      server.close();
      process.exit(1);
    }
  });

  const port = new URL(redirectUri!).port || 3000;
  server.listen(port, () => {
    log(
      LogLevel.INFO,
      `Serveur d'authentification démarré sur le port ${port}`,
    );
    log(LogLevel.INFO, "Ouvrez ce lien dans votre navigateur:");
    console.log("\n" + authUrl + "\n");
  });
}

authenticate();

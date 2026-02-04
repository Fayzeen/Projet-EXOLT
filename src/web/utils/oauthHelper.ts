import fs from "fs/promises";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "tokens.json");

export async function exchangeCodeForTokens(code: string) {
  const clientId = process.env.BETTERAUTH_CLIENT_ID;
  const clientSecret = process.env.BETTERAUTH_CLIENT_SECRET;
  const redirectUri = process.env.BETTERAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Secrets OAuth non configurés dans les variables d'environnement",
    );
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code.trim(),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur OAuth: ${error}`);
  }

  return await response.json();
}

export async function saveTokens(tokens: any) {
  const tokenData = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + tokens.expires_in * 1000,
    scope: tokens.scope,
  };
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
}

export function getOAuthUrl(): string {
  const clientId = process.env.BETTERAUTH_CLIENT_ID;
  const redirectUri = process.env.BETTERAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Secrets OAuth non configurés");
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://mail.google.com/ email",
    access_type: "offline",
    prompt: "consent",
  }).toString()}`;
}

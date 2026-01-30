import fs from "fs/promises";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "tokens.json");

export async function getAccessToken() {
  const data = await fs.readFile(TOKEN_PATH, "utf-8");
  const tokens = JSON.parse(data);

  if (!tokens.access_token) {
    throw new Error("Pas de access_token dans tokens.json");
  }

  if (tokens.expires_at && Date.now() > tokens.expires_at) {
    return await refreshAccessToken(tokens.refresh_token);
  }

  return tokens.access_token;
}

export async function getUserEmail(): Promise<string> {
  const data = await fs.readFile(TOKEN_PATH, "utf-8");
  const tokens = JSON.parse(data);

  if (tokens.email) {
    return tokens.email;
  }

  const userInfo = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    },
  );

  const userData = await userInfo.json();
  tokens.email = userData.email;
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

  return userData.email;
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

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.BETTERAUTH_CLIENT_ID!,
      client_secret: process.env.BETTERAUTH_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const newTokens = await response.json();
  if (!newTokens.refresh_token) newTokens.refresh_token = refreshToken;
  await saveTokens(newTokens);
  return newTokens.access_token;
}

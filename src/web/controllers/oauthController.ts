import type { Request, Response } from "express";
import { exchangeCodeForTokens, saveTokens } from "../utils/oauthHelper.js";

export async function handleOAuthCallback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).send("Code d'autorisation manquant");
    }

    const tokens = await exchangeCodeForTokens(code);
    await saveTokens(tokens);

    return res.redirect("/success");
  } catch (error) {
    console.error("Erreur lors du callback OAuth:", error);
    return res
      .status(500)
      .send(
        "Erreur lors de l'authentification. Veuillez réessayer.",
      );
  }
}
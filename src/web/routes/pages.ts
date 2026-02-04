import { Router, type Request, type Response } from "express";
import path from "path";
import { getOAuthUrl } from "../utils/oauthHelper.js";

const router = Router();

router.get("/login", (req: Request, res: Response) => {
  try {
    const oauthUrl = getOAuthUrl();
    res.redirect(oauthUrl);
  } catch (error) {
    res.status(500).send("Erreur: Configuration OAuth manquante");
  }
});

router.get("/success", (req: Request, res: Response) => {
  res.sendFile("sucess.html", { root: "./src/web/views" });
});

router.get("/", (req: Request, res: Response) => {
  res.sendFile("layout.html", { root: "./src/web/views" });
});

export default router;
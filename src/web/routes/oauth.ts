import { Router } from "express";
import { handleOAuthCallback } from "../controllers/oauthController.js";

const router = Router();

router.get("/callback", handleOAuthCallback);

export default router;
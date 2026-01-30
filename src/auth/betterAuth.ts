import { betterAuth } from "better-auth";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.BETTERAUTH_CLIENT_ID!,
      clientSecret: process.env.BETTERAUTH_CLIENT_SECRET!,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

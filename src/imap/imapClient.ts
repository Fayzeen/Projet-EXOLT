import { ImapFlow } from "imapflow";
import { getAccessToken, getUserEmail } from "../auth/token.js";
import * as dotenv from "dotenv";

dotenv.config();

export async function createImapClient() {
  const accessToken = await getAccessToken();
  const userEmail = await getUserEmail();

  return new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: userEmail,
      accessToken,
    },
    logger: false,
  });
}

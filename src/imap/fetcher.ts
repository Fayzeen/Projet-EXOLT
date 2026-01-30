import { createImapClient } from "./imapClient.js";
import { simpleParser } from "mailparser";
import { log, LogLevel } from "../utils/logger.js";

export async function fetchRecentEmails(limit = 5) {
  const client = await createImapClient();
  await client.connect();

  const lock = await client.getMailboxLock("INBOX");

  try {
    const messages = [];

    const allUIDs = await client.search({});
    const lastUIDs = (allUIDs || []).slice(-limit);

    log(LogLevel.INFO, "UIDs sélectionnés : " + lastUIDs.join(", "));

    const fetched = client.fetch(lastUIDs, {
      envelope: true,
      source: true,
    });

    for await (const message of fetched) {
      const parsed = await simpleParser(message.source);

      const subject = message.envelope?.subject || "(Sans sujet)";
      const from =
        message.envelope?.from?.map((f) => f.address).join(", ") || "Inconnu";

      let text = parsed.text || "";

      if (!text && parsed.html) {
        text = parsed.html
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/p>/gi, "\n\n")
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"');
      }

      const preview =
        text.slice(0, 100).replace(/\n/g, " ") || "{Aucun contenu}";
      log(LogLevel.INFO, "Mail reçu de : " + from);

      messages.push({
        subject,
        from,
        text: text || "{Aucun contenu}",
      });
    }

    log(LogLevel.INFO, "Total des mails récupérés : " + messages.length);
    return messages;
  } catch (error) {
    log(LogLevel.ERROR, "Erreur dans fetchRecentEmails :", error);
    return [];
  } finally {
    lock.release();
    await client.logout();
  }
}

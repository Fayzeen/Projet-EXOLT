import { createImapClient } from "./imapClient.js";
import { simpleParser } from "mailparser";

export async function watchNewEmails(
  onNewEmail: (email: { subject: string; from: string; text: string }) => void,
) {
  const client = await createImapClient();
  await client.connect();
  await client.mailboxOpen("INBOX");

  client.on("exists", async () => {
    try {
      const messages = await client.search({ seen: false });
      if (!messages || messages.length === 0) return;

      const newestUID = messages[messages.length - 1];
      const fetched = client.fetch([newestUID], {
        envelope: true,
        source: true,
      });

      for await (const message of fetched) {
        const parsed = await simpleParser(message.source);

        const subject = message.envelope?.subject || "(Sans sujet)";
        const from =
          message.envelope?.from?.map((f) => f.address).join(", ") || "Inconnu";
        const text = parsed.text || parsed.html || "{Aucun contenu}";

        onNewEmail({ subject, from, text });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nouveau mail :", error);
    }
  });
}

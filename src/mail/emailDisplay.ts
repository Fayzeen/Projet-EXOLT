import {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from "discord.js";

type Mail = {
  subject: string;
  from: string;
  text: string;
};

export function buildEmail(mail: Mail) {
  const subject = mail.subject || "(Sans sujet)";
  const sender = mail.from || "Inconnu";
  const date = new Date().toLocaleString("fr-FR");

  let content = mail.text?.trim() || "Aucun contenu disponible";

  content = content.replace(/https?:\/\/[^\s]+/g, "[lien]");

  content = content.replace(/\n{3,}/g, "\n\n");

  content = content.replace(/[ \t]+/g, " ");

  if (content.length > 800) {
    content = content.slice(0, 800) + "...";
  }

  if (!content || content.length < 10) {
    content = "Aucun contenu textuel disponible";
  }

  const container = new ContainerBuilder()

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`### **${subject}**`),
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`**Expéditeur**\n${sender}`),
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`**Reçu le**\n${date}`),
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Message**\n\`\`\`\n${content}\n\`\`\``,
      ),
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("*Exolt - Mails*"),
    );

  return container;
}

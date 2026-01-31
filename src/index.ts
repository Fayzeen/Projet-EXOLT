import {
  ActivityType,
  Client,
  GatewayIntentBits,
  TextChannel,
  REST,
  Routes,
  ButtonInteraction,
  StringSelectMenuInteraction,
  MessageFlags,
} from "discord.js";
import * as dotenv from "dotenv";

import { fetchRecentEmails } from "./imap/fetcher.js";
import { watchNewEmails } from "./imap/watcher.js";
import { log, LogLevel } from "./utils/logger.js";
import { Config } from "./commands/config/config.js";
import { buildMainMenu } from "./commands/config/builder/mainMenus.js";
import { buildEmail } from "./mail/emailDisplay.js";

dotenv.config();

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.DISCORD_CLIENT_ID!;
const guildId = process.env.DISCORD_GUILD_ID!;
const channelId = process.env.DISCORD_CHANNEL_ID!;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const configMessages = new Map<string, string>();

async function deployCommands() {
  const rest = new REST({ version: "10" }).setToken(token);

  const commands = [
    {
      name: "config",
      description: "Ouvre le menu de configuration du bot",
    },
  ];

  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  });

  log(LogLevel.INFO, "Commande /config déployée.");
}

type Mail = {
  subject: string;
  from: string;
  text: string;
};

async function sendEmailToDiscord(channel: TextChannel, mail: Mail) {
  if (Config.filter.active) {
    const text = (mail.subject + " " + mail.text).toLowerCase();
    if (!text.includes(Config.filter.active.toLowerCase())) return;
  }

  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [buildEmail(mail)],
  });
}

async function handleEditFilter(interaction: ButtonInteraction) {
  await interaction.deferUpdate();

  const messageId = configMessages.get(interaction.user.id);
  if (messageId && interaction.channel) {
    try {
      const originalMessage =
        await interaction.channel.messages.fetch(messageId);

      await originalMessage.edit({
        flags: MessageFlags.IsComponentsV2,
        components: [buildMainMenu(true)],
      });
    } catch (error) {
      log(LogLevel.ERROR, "Impossible d'afficher le menu de sélection");
      console.error(error);
    }
  }
}

async function handleEditLanguage(interaction: ButtonInteraction) {
  await interaction.reply({
    content: "Cette fonctionnalité arrive bientôt.",
    flags: MessageFlags.Ephemeral,
  });
}

async function handleFilterSelect(interaction: StringSelectMenuInteraction) {
  await interaction.deferUpdate();
  const chosen = interaction.values[0];

  if (chosen === "reset") {
    Config.filter.active = null;
  } else {
    Config.filter.active = chosen;
  }

  const messageId = configMessages.get(interaction.user.id);
  if (messageId && interaction.channel) {
    try {
      const originalMessage =
        await interaction.channel.messages.fetch(messageId);
      await originalMessage.edit({
        flags: MessageFlags.IsComponentsV2,
        components: [buildMainMenu(false)],
      });
    } catch (error) {
      log(LogLevel.ERROR, "Impossible de mettre à jour le menu de config");
      console.error(error);
    }
  }
}

async function handleFilterReset(interaction: ButtonInteraction) {
  Config.filter.active = null;

  const messageId = configMessages.get(interaction.user.id);
  if (messageId && interaction.channel) {
    try {
      const originalMessage =
        await interaction.channel.messages.fetch(messageId);
      await originalMessage.edit({
        flags: MessageFlags.IsComponentsV2,
        components: [buildMainMenu(false)],
      });
    } catch (error) {
      log(LogLevel.ERROR, "Impossible de mettre à jour le menu de config");
      console.error(error);
    }
  }

  await interaction.reply({
    content: "Filtre réinitialisé",
    flags: MessageFlags.Ephemeral,
  });
}

async function handleFilterCancel(interaction: ButtonInteraction) {
  await interaction.update({
    content: "Annulé",
    components: [],
  });
}

client.once("ready", async () => {
  log(LogLevel.INFO, `Connecté en tant que ${client.user?.tag}`);
  await deployCommands();

  client.user?.setPresence({
    activities: [{ name: "les mails", type: ActivityType.Watching }],
    status: "online",
  });

  const channel = await client.channels.fetch(channelId);
  if (!channel || !channel.isTextBased()) {
    log(LogLevel.ERROR, "Salon Discord invalide.");
    return;
  }

  const textChannel = channel as TextChannel;

  const emails = await fetchRecentEmails(3);
  for (const mail of emails) {
    await sendEmailToDiscord(textChannel, mail);
  }

  log(LogLevel.DATA, "En attente de nouveaux mails...");
  watchNewEmails(async (mail: Mail) => {
    await sendEmailToDiscord(textChannel, mail);
  });
});

client.on("interactionCreate", async (interaction) => {
  if (
    interaction.isChatInputCommand() &&
    interaction.commandName === "config"
  ) {
    const response = await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [buildMainMenu(false)],
      fetchReply: true,
    });

    configMessages.set(interaction.user.id, response.id);
    return;
  }

  if (interaction.isButton()) {
    if (interaction.customId === "config-edit-filter")
      return handleEditFilter(interaction);

    if (interaction.customId === "config-edit-language")
      return handleEditLanguage(interaction);

    if (interaction.customId === "config-filter-reset")
      return handleFilterReset(interaction);

    if (interaction.customId === "config-filter-cancel")
      return handleFilterCancel(interaction);
  }

  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "config-filter-select"
  ) {
    return handleFilterSelect(interaction);
  }
});

client.login(token);

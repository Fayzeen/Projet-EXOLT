import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Config } from "../config.js";

export function buildFilterSelectMenu() {
  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("config-filter-select")
        .setPlaceholder("Sélectionner un filtre")
        .addOptions(
          Config.filter.options.map((opt) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(opt.label)
              .setValue(opt.value)
              .setDescription(opt.description),
          ),
        ),
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("config-filter-reset")
        .setLabel("Réinitialiser")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("config-filter-cancel")
        .setLabel("Annuler")
        .setStyle(ButtonStyle.Secondary),
    ),
  ];
}

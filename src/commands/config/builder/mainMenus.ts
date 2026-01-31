import {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SectionBuilder,
  ButtonBuilder,
  ButtonStyle,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} from "discord.js";
import { Config } from "../config.js";

const config = Config;

export function buildMainMenu(showFilterMenu: boolean = false) {
  const container = new ContainerBuilder()

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("# Configuration du bot EXOLT"),
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    );

  if (!showFilterMenu) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**Filtre actif**\n${
              config.filter.active
                ? `\`${config.filter.active}\``
                : "Aucun filtre sélectionné"
            }`,
          ),
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("config-edit-filter")
            .setLabel("Modifier")
            .setStyle(ButtonStyle.Primary),
        ),
    );
  } else {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Filtre actif**\n${
          config.filter.active
            ? `\`${config.filter.active}\``
            : "Aucun filtre sélectionné"
        }`,
      ),
    );

    const filterSelect = new StringSelectMenuBuilder()
      .setCustomId("config-filter-select")
      .setPlaceholder("Choisir un filtre...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("PayPal")
          .setValue("paypal")
          .setDescription("Filtrer les emails PayPal"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Amazon")
          .setValue("amazon")
          .setDescription("Filtrer les emails Amazon"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Important")
          .setValue("important")
          .setDescription("Filtrer les emails importants"),
        new StringSelectMenuOptionBuilder()
          .setLabel("CV")
          .setValue("curriculum vitae")
          .setDescription("Filtrer les CV"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Réinitialiser")
          .setValue("reset")
          .setDescription("Supprimer le filtre actif"),
      );

    container.addActionRowComponents((actionRow) =>
      actionRow.setComponents(filterSelect),
    );
  }

  container
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )

    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**Langue**\n\`${config.language}\``,
          ),
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId("config-edit-language")
            .setLabel("Modifier")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        ),
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        "**Sections disponibles**\n» Filtres de mails\n» Langue (bientôt)\n» Autres (bientôt)",
      ),
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )

    .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder()
          .setURL("https://imgur.com/tnY6WDP.png")
          .setDescription("Bannière Exolt"),
      ),
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("*Exolt 𝘪𝘯 𝘱𝘳𝘰𝘨𝘳𝘦𝘴𝘴*"),
    );

  return container;
}

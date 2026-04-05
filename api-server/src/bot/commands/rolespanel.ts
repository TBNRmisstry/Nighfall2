import * as discord from "discord.js";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  chatInputApplicationCommandMention,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

export const data = new discord.SlashCommandBuilder()
  .setName("roles-panel")
  .setDescription("Send the role selection panel to this channel")
  .setDefaultMemberPermissions(discord.PermissionFlagsBits.ManageGuild)
  .addStringOption((opt) =>
    opt
      .setName("type")
      .setDescription("Which panel to send")
      .setRequired(false)
      .addChoices(
        { name: "Game Roles (Killer / Survivor / Spectator)", value: "game" },
        { name: "Ping Roles (Game Updates / Dev Log)", value: "ping" },
        { name: "Ping Roles (Events / Annoucments)", value: "ping" },
        { name: "Ping Roles (Community access / Image perms / Nickname perms)", value: "ping" },
      )
  );

  const embed = new discord.EmbedBuilder()
    .setTitle('🎛️ Access Roles/ping roles')
    .setDescription(`
🔔 **Ping Roles**
• Updates
• Events
• Announcements

────────────

🔐 **Access Roles**
🌐 Community (Lv 5)
✏️ Nicknames (Lv 10)
🖼️ Images (Lv 15)
    `);


export async function execute(interaction: discord.ChatInputCommandInteraction) {
  const type = interaction.options.getString("type") ?? "game";
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {
    await interaction.reply({ content: "Must be used in a server text channel.", flags: discord.MessageFlags.Ephemeral });
    return;
  }

  if (type === "game") {
    const embed = new discord.EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Choose Your Game Role")
      .setDescription(
        "Click a button to assign or remove your game role.\n\n" +
        "🔪 **Killer** — You play as the killer\n" +
        "🏃 **Survivor** — You play as a survivor\n" +
        "👁️ **Spectator** — You watch matches"
      )
      .setFooter({ text: "Click again to remove a role" });

    const row = new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(
      new discord.ButtonBuilder().setCustomId("role_killer").setLabel("🔪  Killer").setStyle(discord.ButtonStyle.Danger),
      new discord.ButtonBuilder().setCustomId("role_survivor").setLabel("🏃  Survivor").setStyle(discord.ButtonStyle.Success),
      new discord.ButtonBuilder().setCustomId("role_spectator").setLabel("👁️  Spectator").setStyle(discord.ButtonStyle.Secondary),
    );

    await channel.send({ embeds: [embed], components: [row] });
  } else {
    const embed = new discord.EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Choose Your Ping Roles")
      .setDescription(
        "Click a button to get or remove ping notifications.\n\n" +
        "🎮 **Game Updates** — Get pinged for game announcements\n" +
        "🛠️ **Dev Log** — Get pinged for developer updates"
      )
      .setFooter({ text: "Click again to remove a role" });

    const row = new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(
      new discord.ButtonBuilder().setCustomId("ping_game_updates").setLabel("🎮  Game Updates").setStyle(discord.ButtonStyle.Primary),
      new discord.ButtonBuilder().setCustomId("ping_dev_log").setLabel("🛠️  Dev Log").setStyle(discord.ButtonStyle.Secondary),
    );

    await channel.send({ embeds: [embed], components: [row] });
  }  {
    const embed = new discord.EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Choose Your Ping Roles")
      .setDescription(
        "Click a button to get or remove ping notifications.\n\n" +
        "🎮 **Game Updates** — Get pinged for game announcements\n" +
        "🛠️ **Dev Log** — Get pinged for developer updates"
      )
      .setFooter({ text: "Click again to remove a role" });

    const row = new discord.ActionRowBuilder<discord.ButtonBuilder>().addComponents(
      new discord.ButtonBuilder().setCustomId("ping_game_updates").setLabel("🎮  Game Updates").setStyle(discord.ButtonStyle.Primary),
      new discord.ButtonBuilder().setCustomId("ping_dev_log").setLabel("🛠️  Dev Log").setStyle(discord.ButtonStyle.Secondary),
    );

    await channel.send({ embeds: [embed], components: [row] });
  }

  await interaction.reply({ content: "Role panel posted.", flags: discord.MessageFlags.Ephemeral });
}
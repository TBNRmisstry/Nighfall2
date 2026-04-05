import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("panels")
  .setDescription("Send all role panels to the correct channels")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({ content: "Must be used in a server.", ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  // ===== PING PANEL → #ping-roles =====
  const pingChannel = guild.channels.cache.find(
    (c) => c.name === "ping-roles" && c.isTextBased()
  ) as TextChannel | undefined;

  if (pingChannel) {
    const pingEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🔔 Ping Roles")
      .setDescription(
        "Click the buttons below to toggle notification pings.\nClick again to remove the role."
      );

    const pingRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("update_ping")
        .setLabel("Game Updates")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("events_ping")
        .setLabel("Events")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("announce_ping")
        .setLabel("Announcements")
        .setStyle(ButtonStyle.Secondary)
    );

    await pingChannel.send({ embeds: [pingEmbed], components: [pingRow] });
  }

  // ===== ACCESS PANELS → #access-roles =====
  const accessChannel = guild.channels.cache.find(
    (c) => c.name === "access-roles" && c.isTextBased()
  ) as TextChannel | undefined;

  if (accessChannel) {
    // Community Access (Lv 5+)
    const communityEmbed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle("🌐 Community Access")
      .setDescription("Unlocks community channels.\n**Requires:** Lv 5");

    const communityRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("community_access")
        .setLabel("Unlock Community")
        .setStyle(ButtonStyle.Success)
    );

    // Nickname Perms (Lv 10+)
    const nickEmbed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle("✏️ Nickname Permissions")
      .setDescription("Allows you to change your nickname.\n**Requires:** Lv 10");

    const nickRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("nickname_perm")
        .setLabel("Enable Nicknames")
        .setStyle(ButtonStyle.Secondary)
    );

    // Image Perms (Lv 15+)
    const imageEmbed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle("🖼️ Image Permissions")
      .setDescription("Allows you to post images in chat.\n**Requires:** Lv 15");

    const imageRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("image_perm")
        .setLabel("Enable Images")
        .setStyle(ButtonStyle.Danger)
    );

    await accessChannel.send({ embeds: [communityEmbed], components: [communityRow] });
    await accessChannel.send({ embeds: [nickEmbed], components: [nickRow] });
    await accessChannel.send({ embeds: [imageEmbed], components: [imageRow] });
  }

  const sent = [];
  if (pingChannel) sent.push("`#ping-roles`");
  if (accessChannel) sent.push("`#access-roles`");

  const missing = [];
  if (!pingChannel) missing.push("`#ping-roles`");
  if (!accessChannel) missing.push("`#access-roles`");

  let reply = sent.length ? `✅ Panels sent to ${sent.join(" and ")}.` : "⚠️ No panels sent.";
  if (missing.length) reply += `\n⚠️ Could not find: ${missing.join(", ")} — run \`/setup\` first.`;

  await interaction.editReply({ content: reply });
}

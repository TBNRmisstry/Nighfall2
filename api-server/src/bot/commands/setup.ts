import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  OverwriteType,
  EmbedBuilder,
  Guild,
  Role,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Build a Forsaken-style Roblox Asym game server from scratch")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function createRole(guild: Guild, name: string, color = 0x000000): Promise<Role> {
  const existing = guild.roles.cache.find((r) => r.name === name);
  if (existing) return existing;
  return guild.roles.create({ name, color });
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({ content: "This command must be used in a server.", ephemeral: true });
    return;
  }

  await interaction.reply({ content: "⚙️ Building your Forsaken-style server... this may take a moment.", ephemeral: true });

  const everyoneId = guild.roles.everyone.id;

  // ===== ROLES =====
  const verifiedRole   = await createRole(guild, "Verified",           0x57f287);
  const devRole        = await createRole(guild, "Developer",          0xed4245);
  const staffRole      = await createRole(guild, "Staff",              0xfee75c);
  const modRole        = await createRole(guild, "Mod",                0xfee75c);
  const headModRole    = await createRole(guild, "Head Mod",           0xf47fff);
  const trialModRole   = await createRole(guild, "Trial Mod",         0x99aab5);
  const helperRole     = await createRole(guild, "Helper",             0x5865f2);
  await createRole(guild, "Bots",                                       0x99aab5);

  // Game roles
  await createRole(guild, "Killer",                                     0xed4245);
  await createRole(guild, "Survivor",                                   0x57f287);
  await createRole(guild, "Spectator",                                  0x99aab5);

  // Ping roles
  await createRole(guild, "Game Updates Ping",                         0x5865f2);
  await createRole(guild, "Dev Log Ping",                              0x5865f2);
  await createRole(guild, "Events Ping",                               0x5865f2);
  await createRole(guild, "Announcements Ping",                        0x5865f2);

  // Access roles (unlocked via /panels buttons)
  await createRole(guild, "Community Access",                          0x57f287);
  await createRole(guild, "Nickname Perms",                            0xfee75c);
  await createRole(guild, "Image Perms",                               0xed4245);

  // Level roles (for level gating via panels)
  for (const lvl of [5, 10, 15, 20, 25, 30, 40, 50]) {
    await createRole(guild, `Lv ${lvl}`, 0x5865f2);
  }

  const staffRoleIds = [devRole.id, staffRole.id, modRole.id, headModRole.id, trialModRole.id, helperRole.id];

  const readOnly = [
    { id: everyoneId, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
  ];

  const locked = [
    { id: everyoneId, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
  ];

  // ===== 📢 IMPORTANT (top-level, no category) =====
  const important = await guild.channels.create({ name: "📢 Important", type: ChannelType.GuildCategory });
  for (const name of ["announcements", "sub-announcements", "update-log", "dev-log", "polls", "ugc", "socials"]) {
    await guild.channels.create({ name, type: ChannelType.GuildText, parent: important.id, permissionOverwrites: readOnly });
  }

  // ===== 📜 INFORMATION =====
  const info = await guild.channels.create({ name: "📜 Information", type: ChannelType.GuildCategory });
  for (const name of ["rules", "how-to-report-or-appeal", "faq", "ping-roles", "links", "access-roles"]) {
    await guild.channels.create({ name, type: ChannelType.GuildText, parent: info.id, permissionOverwrites: readOnly });
  }

  // ===== 🎮 GAME =====
  const game = await guild.channels.create({ name: "🎮 Game", type: ChannelType.GuildCategory });
  for (const name of ["game-news", "game-updates", "patch-notes", "game-chat", "bug-reports"]) {
    await guild.channels.create({ name, type: ChannelType.GuildText, parent: game.id });
  }

  // ===== 💬 CHATS =====
  const chats = await guild.channels.create({ name: "💬 Chats", type: ChannelType.GuildCategory });
  for (const name of ["general", "bot-commands", "forsaken", "creations", "off-topic"]) {
    await guild.channels.create({ name, type: ChannelType.GuildText, parent: chats.id });
  }

  // ===== 🌐 COMMUNITY =====
  const community = await guild.channels.create({ name: "🌐 Community", type: ChannelType.GuildCategory });
  for (const name of ["videos", "fan-art", "events", "poll-responses"]) {
    await guild.channels.create({ name, type: ChannelType.GuildText, parent: community.id, permissionOverwrites: readOnly });
  }
  await guild.channels.create({ name: "staff-shitpost", type: ChannelType.GuildText, parent: community.id, permissionOverwrites: [
    ...locked,
    ...staffRoleIds.map((id) => ({ id, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] })),
  ]});

  // ===== 🔊 VOICE =====
  const voice = await guild.channels.create({ name: "🔊 Voice Chats", type: ChannelType.GuildCategory });
  for (const name of ["General 1", "General 2", "General 3", "AFK"]) {
    await guild.channels.create({ name, type: ChannelType.GuildVoice, parent: voice.id });
  }

  // ===== 🛠️ STAFF (hidden) =====
  const staffCat = await guild.channels.create({
    name: "🛠️ Staff",
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id: everyoneId, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
      ...staffRoleIds.map((id) => ({ id, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] })),
    ],
  });
  for (const name of ["mod-chat", "reports", "action-log", "dev-zone", "game-zone"]) {
    await guild.channels.create({ name, type: ChannelType.GuildText, parent: staffCat.id, permissionOverwrites: [
      { id: everyoneId, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
      ...staffRoleIds.map((id) => ({ id, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] })),
    ]});
  }

  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle("✅ Server Setup Complete")
    .setDescription("Your Forsaken-style Roblox Asym game server has been created.")
    .addFields(
      { name: "Roles Created", value: "Verified, Developer, Staff, Mod, Helper, Killer, Survivor, Spectator, Ping roles, Access roles, Level roles" },
      { name: "Categories Created", value: "Important, Information, Game, Chats, Community, Voice, Staff" },
      { name: "Next Steps", value: "• Run `/verify-panel` in `#access-roles`\n• Run `/panels` to send role panels\n• Assign yourself the Developer role" },
    )
    .setTimestamp();

  await interaction.editReply({ content: "", embeds: [embed] });
}

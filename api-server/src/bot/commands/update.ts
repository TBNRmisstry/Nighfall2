import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("update")
  .setDescription("Post a game update log")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((opt) => opt.setName("version").setDescription("Version or update name e.g. v1.2.0").setRequired(true))
  .addStringOption((opt) => opt.setName("notes").setDescription("What changed in this update").setRequired(true))
  .addStringOption((opt) =>
    opt
      .setName("type")
      .setDescription("Update type")
      .setRequired(false)
      .addChoices(
        { name: "Patch", value: "patch" },
        { name: "Minor", value: "minor" },
        { name: "Major", value: "major" },
        { name: "Hotfix", value: "hotfix" },
      )
  );

const typeConfig: Record<string, { color: number; emoji: string }> = {
  patch: { color: 0x57f287, emoji: "🔧" },
  minor: { color: 0x5865f2, emoji: "🔄" },
  major: { color: 0xed4245, emoji: "🚀" },
  hotfix: { color: 0xfee75c, emoji: "🔥" },
};

export async function execute(interaction: ChatInputCommandInteraction) {
  const version = interaction.options.getString("version", true);
  const notes = interaction.options.getString("notes", true);
  const type = interaction.options.getString("type") ?? "patch";
  const config = typeConfig[type] ?? typeConfig["patch"]!;

  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle(`${config.emoji} Update — ${version}`)
    .setDescription(notes)
    .setFooter({ text: `Update posted by ${interaction.user.username}` })
    .setTimestamp();

  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {
    await interaction.reply({ content: "Must be used in a server text channel.", flags: MessageFlags.Ephemeral });
    return;
  }

  await channel.send({ embeds: [embed] });
  await interaction.reply({ content: "Update posted!", flags: MessageFlags.Ephemeral });
}

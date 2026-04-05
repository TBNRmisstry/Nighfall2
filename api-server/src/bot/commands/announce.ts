import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("announce")
  .setDescription("Post a styled announcement")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((opt) =>
    opt.setName("title").setDescription("Announcement title").setRequired(true)
  )
  .addStringOption((opt) =>
    opt.setName("message").setDescription("Announcement body").setRequired(true)
  )
  .addStringOption((opt) =>
    opt
      .setName("type")
      .setDescription("Type of announcement")
      .setRequired(false)
      .addChoices(
        { name: "General", value: "general" },
        { name: "Update", value: "update" },
        { name: "Dev Log", value: "devlog" },
        { name: "Event", value: "event" },
      )
  );

const typeConfig: Record<string, { color: number; emoji: string; label: string }> = {
  general: { color: 0x5865f2, emoji: "📢", label: "Announcement" },
  update: { color: 0x57f287, emoji: "🔄", label: "Update" },
  devlog: { color: 0xed4245, emoji: "🛠️", label: "Dev Log" },
  event: { color: 0xfee75c, emoji: "🎮", label: "Event" },
};

export async function execute(interaction: ChatInputCommandInteraction) {
  const title = interaction.options.getString("title", true);
  const message = interaction.options.getString("message", true);
  const type = interaction.options.getString("type") ?? "general";
  const config = typeConfig[type] ?? typeConfig["general"]!;

  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle(`${config.emoji} ${title}`)
    .setDescription(message)
    .setFooter({ text: `${config.label} • Posted by ${interaction.user.username}` })
    .setTimestamp();

  await interaction.reply({ content: "Announcement posted!", ephemeral: true });
  const channel = interaction.channel;
  if (channel && channel.isTextBased() && !channel.isDMBased()) {
    await channel.send({ embeds: [embed] });
  }
}

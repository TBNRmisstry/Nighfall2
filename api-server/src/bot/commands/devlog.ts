import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("devlog")
  .setDescription("Post a developer log entry")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((opt) => opt.setName("title").setDescription("Log title").setRequired(true))
  .addStringOption((opt) => opt.setName("content").setDescription("What you've been working on").setRequired(true))
  .addStringOption((opt) => opt.setName("progress").setDescription("Optional progress note e.g. 70% done").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const title = interaction.options.getString("title", true);
  const content = interaction.options.getString("content", true);
  const progress = interaction.options.getString("progress");

  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle(`🛠️ Dev Log — ${title}`)
    .setDescription(content)
    .setFooter({ text: `Posted by ${interaction.user.username}` })
    .setTimestamp();

  if (progress) {
    embed.addFields({ name: "Progress", value: progress, inline: true });
  }

  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {
    await interaction.reply({ content: "Must be used in a server text channel.", flags: MessageFlags.Ephemeral });
    return;
  }

  await channel.send({ embeds: [embed] });
  await interaction.reply({ content: "Dev log posted!", flags: MessageFlags.Ephemeral });
}

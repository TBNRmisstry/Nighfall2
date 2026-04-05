import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll with up to 4 options")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((opt) => opt.setName("question").setDescription("The poll question").setRequired(true))
  .addStringOption((opt) => opt.setName("option1").setDescription("First option").setRequired(true))
  .addStringOption((opt) => opt.setName("option2").setDescription("Second option").setRequired(true))
  .addStringOption((opt) => opt.setName("option3").setDescription("Third option (optional)").setRequired(false))
  .addStringOption((opt) => opt.setName("option4").setDescription("Fourth option (optional)").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString("question", true);
  const options = [
    interaction.options.getString("option1", true),
    interaction.options.getString("option2", true),
    interaction.options.getString("option3"),
    interaction.options.getString("option4"),
  ].filter((o): o is string => o !== null);

  const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

  const embed = new EmbedBuilder()
    .setColor(0xfee75c)
    .setTitle(`📊 ${question}`)
    .setDescription(options.map((o, i) => `${emojis[i]} **${o}**`).join("\n\n"))
    .setFooter({ text: `Poll by ${interaction.user.username}` })
    .setTimestamp();

  const buttons = options.map((o, i) =>
    new ButtonBuilder()
      .setCustomId(`poll_vote_${i}`)
      .setLabel(`${emojis[i]} ${o}`)
      .setStyle(ButtonStyle.Primary)
  );

  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(i, i + 2)));
  }

  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {
    await interaction.reply({ content: "Must be used in a server text channel.", flags: MessageFlags.Ephemeral });
    return;
  }

  await channel.send({ embeds: [embed], components: rows });
  await interaction.reply({ content: "Poll posted!", flags: MessageFlags.Ephemeral });
}

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";
import { startMatch, getQueueSize } from "../systems/queueSystem.js";

export const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("Start a match — randomly selects a killer from the queue")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction: ChatInputCommandInteraction) {
  const size = getQueueSize();

  if (size < 2) {
    await interaction.reply({
      content: `Not enough players to start a match. Need at least 2, currently **${size}** in queue.`,
      ephemeral: true,
    });
    return;
  }

  const match = startMatch();
  if (!match) {
    await interaction.reply({ content: "Failed to start match.", ephemeral: true });
    return;
  }

  const survivorMentions = match.survivors.map((id) => `<@${id}>`).join(", ");

  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle("Match Started!")
    .addFields(
      { name: "Killer", value: `<@${match.killer}>`, inline: true },
      { name: "Survivors", value: survivorMentions || "None", inline: true },
    )
    .setFooter({ text: `${match.survivors.length + 1} players` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

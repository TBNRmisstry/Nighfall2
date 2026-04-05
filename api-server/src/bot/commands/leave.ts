import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { leaveQueue, getQueue } from "../systems/queueSystem.js";

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leave the game queue");

export async function execute(interaction: ChatInputCommandInteraction) {
  const success = leaveQueue(interaction.user.id);

  if (!success) {
    await interaction.reply({ content: "You are not in the queue.", ephemeral: true });
    return;
  }

  const currentQueue = getQueue();

  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle("Left Queue")
    .setDescription(`**${interaction.user.username}** left the queue.`)
    .addFields({ name: "Players remaining", value: `${currentQueue.length}`, inline: true })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

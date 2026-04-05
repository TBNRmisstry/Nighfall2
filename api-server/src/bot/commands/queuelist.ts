import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getQueue } from "../systems/queueSystem.js";

export const data = new SlashCommandBuilder()
  .setName("queuelist")
  .setDescription("Show everyone currently in the game queue");

export async function execute(interaction: ChatInputCommandInteraction) {
  const queue = getQueue();

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Game Queue")
    .setDescription(
      queue.length === 0
        ? "The queue is empty. Use `/queue` to join!"
        : queue.map((id, i) => `${i + 1}. <@${id}>`).join("\n")
    )
    .addFields({ name: "Players", value: `${queue.length}`, inline: true })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

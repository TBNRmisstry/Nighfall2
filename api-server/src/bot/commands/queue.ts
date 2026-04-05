import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { joinQueue, getQueue } from "../systems/queueSystem.js";

export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Join the game queue");

export async function execute(interaction: ChatInputCommandInteraction) {
  const success = joinQueue(interaction.user.id);

  if (!success) {
    await interaction.reply({ content: "You are already in the queue!", ephemeral: true });
    return;
  }

  const currentQueue = getQueue();

  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle("Joined Queue")
    .setDescription(`**${interaction.user.username}** joined the queue.`)
    .addFields({ name: "Players in Queue", value: `${currentQueue.length}`, inline: true })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

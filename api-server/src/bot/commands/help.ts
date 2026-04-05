import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("List all available commands");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Available Commands")
    .addFields(
      {
        name: "General",
        value: [
          "`/ping` — Check bot latency",
          "`/help` — Show this message",
          "`/serverinfo` — Show server information",
        ].join("\n"),
      },
      {
        name: "Game Queue",
        value: [
          "`/queue` — Join the game queue",
          "`/leave` — Leave the game queue",
          "`/queuelist` — View everyone in queue",
          "`/start` — Start a match and pick a killer (staff)",
        ].join("\n"),
      },
      {
        name: "Staff Panels",
        value: [
          "`/verify-panel` — Post the verification button",
          "`/roles-panel` — Post the role selection buttons",
        ].join("\n"),
      },
      {
        name: "Staff Announcements",
        value: [
          "`/announce` — Post a styled announcement",
          "`/update` — Post a game update log",
          "`/devlog` — Post a developer log entry",
          "`/poll` — Create a poll with up to 4 options",
        ].join("\n"),
      },
      {
        name: "Admin",
        value: "`/setup` — Build the full Forsaken-style server structure",
      },
    )
    .setFooter({ text: "Forsaken Bot" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

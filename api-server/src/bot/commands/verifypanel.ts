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
  .setName("verify-panel")
  .setDescription("Send the verification button panel to this channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction: ChatInputCommandInteraction) {
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {
    await interaction.reply({ content: "Must be used in a server text channel.", flags: MessageFlags.Ephemeral });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle("Welcome — Verify to Enter")
    .setDescription(
      "Click the button below to verify yourself and gain access to the server.\n\n" +
      "By verifying, you agree to follow our rules."
    )
    .setFooter({ text: "You will receive the Verified role" });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("verify_button")
      .setLabel("✅  Verify Me")
      .setStyle(ButtonStyle.Success)
  );

  await channel.send({ embeds: [embed], components: [row] });
  await interaction.reply({ content: "Verification panel posted.", flags: MessageFlags.Ephemeral });
}

import { ButtonInteraction, MessageFlags } from "discord.js";
import { logger } from "../../lib/logger.js";

// Track poll votes: messageId -> { optionIndex -> Set of userIds }
const pollVotes = new Map<string, Map<number, Set<string>>>();

export async function handleButton(interaction: ButtonInteraction) {
  const id = interaction.customId;
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply({ content: "Could not process your request.", flags: MessageFlags.Ephemeral });
    return;
  }

  // Fetch the full GuildMember to get typed role manager
  const member = await guild.members.fetch(interaction.user.id).catch(() => null);

  if (!member) {
    await interaction.reply({ content: "Could not find your member data.", flags: MessageFlags.Ephemeral });
    return;
  }

  // Helper: toggle a role by name, returns true if added, false if removed
  async function toggleRole(roleName: string): Promise<boolean | null> {
    const role = guild!.roles.cache.find((r) => r.name === roleName);
    if (!role) return null;
    if (member!.roles.cache.has(role.id)) {
      await member!.roles.remove(role);
      return false;
    } else {
      await member!.roles.add(role);
      return true;
    }
  }

  // Helper: check if member has a role by name
  function hasRole(roleName: string): boolean {
    return member!.roles.cache.some((r) => r.name === roleName);
  }

  // ===== VERIFY =====
  if (id === "verify_button") {
    const verifiedRole = guild.roles.cache.find((r) => r.name === "Verified");
    if (!verifiedRole) {
      await interaction.reply({ content: "Verified role not found. Run `/setup` first.", flags: MessageFlags.Ephemeral });
      return;
    }
    if (member.roles.cache.has(verifiedRole.id)) {
      await interaction.reply({ content: "You are already verified!", flags: MessageFlags.Ephemeral });
      return;
    }
    await member.roles.add(verifiedRole);
    await interaction.reply({ content: "✅ You are now verified and can access the server!", flags: MessageFlags.Ephemeral });
    logger.info({ user: interaction.user.tag }, "User verified");
    return;
  }

  // ===== GAME ROLES (Killer / Survivor / Spectator) =====
  const gameRoleMap: Record<string, string> = {
    role_killer: "Killer",
    role_survivor: "Survivor",
    role_spectator: "Spectator",
  };

  if (id in gameRoleMap) {
    const roleName = gameRoleMap[id]!;
    const added = await toggleRole(roleName);
    if (added === null) {
      await interaction.reply({ content: `Role "${roleName}" not found. Run \`/setup\` first.`, flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: added ? `✅ You now have the **${roleName}** role!` : `Removed the **${roleName}** role.`, flags: MessageFlags.Ephemeral });
    }
    return;
  }

  // ===== PING ROLES (from /rolespanel ping) =====
  const pingRoleMap: Record<string, string> = {
    ping_game_updates: "Game Updates Ping",
    ping_dev_log: "Dev Log Ping",
    update_ping: "Game Updates Ping",
    events_ping: "Events Ping",
    announce_ping: "Announcements Ping",
  };

  if (id in pingRoleMap) {
    const roleName = pingRoleMap[id]!;
    const added = await toggleRole(roleName);
    if (added === null) {
      await interaction.reply({ content: `Role "${roleName}" not found. Run \`/setup\` first.`, flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: added ? `🔔 **${roleName}** enabled!` : `🔕 **${roleName}** disabled.`, flags: MessageFlags.Ephemeral });
    }
    return;
  }

  // ===== ACCESS ROLES (from /panels) =====
  if (id === "community_access") {
    if (!hasRole("Lv 5")) {
      await interaction.reply({ content: "❌ You need **Lv 5** to unlock Community Access.", flags: MessageFlags.Ephemeral });
      return;
    }
    const added = await toggleRole("Community Access");
    if (added === null) {
      await interaction.reply({ content: 'Role "Community Access" not found. Run `/setup` first.', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: added ? "✅ Community channels unlocked!" : "Removed Community Access.", flags: MessageFlags.Ephemeral });
    }
    return;
  }

  if (id === "nickname_perm") {
    if (!hasRole("Lv 10")) {
      await interaction.reply({ content: "❌ You need **Lv 10** to unlock Nickname Permissions.", flags: MessageFlags.Ephemeral });
      return;
    }
    const added = await toggleRole("Nickname Perms");
    if (added === null) {
      await interaction.reply({ content: 'Role "Nickname Perms" not found. Run `/setup` first.', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: added ? "✅ Nickname permissions enabled!" : "Removed Nickname Permissions.", flags: MessageFlags.Ephemeral });
    }
    return;
  }

  if (id === "image_perm") {
    if (!hasRole("Lv 15")) {
      await interaction.reply({ content: "❌ You need **Lv 15** to unlock Image Permissions.", flags: MessageFlags.Ephemeral });
      return;
    }
    const added = await toggleRole("Image Perms");
    if (added === null) {
      await interaction.reply({ content: 'Role "Image Perms" not found. Run `/setup` first.', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: added ? "✅ Image permissions enabled!" : "Removed Image Permissions.", flags: MessageFlags.Ephemeral });
    }
    return;
  }

  // ===== POLL VOTES =====
  if (id.startsWith("poll_vote_")) {
    const optionIndex = parseInt(id.replace("poll_vote_", ""), 10);
    const messageId = interaction.message.id;
    const userId = interaction.user.id;

    if (!pollVotes.has(messageId)) pollVotes.set(messageId, new Map());
    const votes = pollVotes.get(messageId)!;

    // Remove vote from any other option
    for (const [idx, voters] of votes) {
      if (idx !== optionIndex) voters.delete(userId);
    }

    if (!votes.has(optionIndex)) votes.set(optionIndex, new Set());
    const optionVoters = votes.get(optionIndex)!;

    if (optionVoters.has(userId)) {
      optionVoters.delete(userId);
      await interaction.reply({ content: "Removed your vote.", flags: MessageFlags.Ephemeral });
    } else {
      optionVoters.add(userId);
      const total = [...votes.values()].reduce((sum, s) => sum + s.size, 0);
      await interaction.reply({ content: `✅ Vote recorded! Total votes: **${total}**`, flags: MessageFlags.Ephemeral });
    }
    return;
  }

  await interaction.reply({ content: "Unknown button.", flags: MessageFlags.Ephemeral });
}

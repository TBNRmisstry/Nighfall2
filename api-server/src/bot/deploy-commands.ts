import { REST, Routes } from "discord.js";
import { logger } from "../lib/logger.js";
import * as pingCommand from "./commands/ping.js";
import * as helpCommand from "./commands/help.js";
import * as serverinfoCommand from "./commands/serverinfo.js";
import * as setupCommand from "./commands/setup.js";
import * as queueCommand from "./commands/queue.js";
import * as leaveCommand from "./commands/leave.js";
import * as startCommand from "./commands/start.js";
import * as panelsCommand from './commands/panels.js';
import * as announceCommand from "./commands/announce.js";
import * as queuelistCommand from "./commands/queuelist.js";
import * as verifypanelCommand from "./commands/verifypanel.js";
import * as rolespanelCommand from "./commands/rolespanel.js";
import * as pollCommand from "./commands/poll.js";
import * as updateCommand from "./commands/update.js";
import * as devlogCommand from "./commands/devlog.js";

const commands = [
  pingCommand,
  helpCommand,
  serverinfoCommand,
  setupCommand,
  queueCommand,
  leaveCommand,
  startCommand,
  panelsCommand,
  announceCommand,
  queuelistCommand,
  verifypanelCommand,
  rolespanelCommand,
  pollCommand,
  updateCommand,
  devlogCommand,
];

export async function deployCommands() {
  const token = process.env["DISCORD_TOKEN"];
  const clientId = process.env["DISCORD_CLIENT_ID"];

  if (!token || !clientId) {
    logger.warn("DISCORD_TOKEN or DISCORD_CLIENT_ID not set — skipping slash command deployment");
    return;
  }

  const rest = new REST({ version: "10" }).setToken(token);
  const commandData = commands.map((cmd) => cmd.data.toJSON());

  try {
    logger.info({ count: commandData.length }, "Deploying slash commands...");
    await rest.put(Routes.applicationCommands(clientId), { body: commandData });
    logger.info("Slash commands deployed successfully");
  } catch (err) {
    logger.error({ err }, "Failed to deploy slash commands");
  }
}

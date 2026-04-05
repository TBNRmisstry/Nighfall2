import {
  Client,
  GatewayIntentBits,
  Collection,
  ChatInputCommandInteraction,
  Interaction,
} from "discord.js";
import { logger } from "../lib/logger.js";
import { handleButton } from "./handlers/buttonHandler.js";
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

interface Command {
  data: { name: string; toJSON(): unknown };
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

const commands: Command[] = [
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

export function startBot() {
  const token = process.env["DISCORD_TOKEN"];
  if (!token) {
    logger.warn("DISCORD_TOKEN not set — Discord bot will not start");
    return;
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

  const commandCollection = new Collection<string, Command>();
  for (const command of commands) {
    commandCollection.set(command.data.name, command);
  }

  client.once("clientReady", (readyClient) => {
    logger.info({ tag: readyClient.user.tag }, "Discord bot logged in");
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isButton()) {
      try {
        await handleButton(interaction);
      } catch (error) {
        logger.error({ error, buttonId: interaction.customId }, "Button handler error");
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = commandCollection.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error({ error, command: interaction.commandName }, "Command error");
      const reply =
        interaction.replied || interaction.deferred
          ? interaction.followUp({ content: "Something went wrong if your not on a server that has community enabled setup command will not work properly.", ephemeral: true })
          : interaction.reply({ content: "Something went wrong.", ephemeral: true });
      await reply;
    }
  });
  
  client.login(token).catch((err) => {
    logger.error({ err }, "Failed to login to Discord");
  });

  return client;
}

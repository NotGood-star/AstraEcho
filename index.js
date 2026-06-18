import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

// 1. WEB SERVER: Keeps the bot alive on Render
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('AstraEcho is running!');
});

server.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

// 2. DISCORD SETUP
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// 3. DYNAMIC COMMAND LOADER
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = `file://${path.join(commandsPath, file)}`;
        const command = await import(filePath);
        if (command.default?.data) {
            client.commands.set(command.default.data.name, command.default);
        }
    }
}

// 4. EVENT LISTENERS
client.once('clientReady', () => {
    console.log(`AstraEcho is logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error executing this command.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);

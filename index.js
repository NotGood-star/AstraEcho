const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express'); // Added for Render
require('dotenv').config();

// --- Keep-Alive Web Server ---
const app = express();
app.get('/', (req, res) => res.send('AstraEcho is running!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server is active.'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load Commands (Recursive)
const loadCommands = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            }
        }
    }
};

loadCommands(path.join(__dirname, 'commands'));

// Client Ready
client.once(Events.ClientReady, (c) => {
    console.log(`🚀 AstraEcho is online as ${c.user.tag}!`);
});

// Interaction Handling
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error executing command.', ephemeral: true });
    }
});

client.login(process.env.TOKEN);

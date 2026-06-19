const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
require('dotenv').config();

// 1. Keep-Alive Server (Necessary for Render)
const app = express();
app.get('/', (req, res) => res.send('AstraEcho is alive!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

// 2. Client Setup
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// 3. Recursive Command Loader with Debugging
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
                console.log(`✅ Loaded command: ${command.data.name}`);
            } else {
                console.log(`⚠️ Skipping ${file}: Missing data or execute.`);
            }
        }
    }
};

loadCommands(path.join(__dirname, 'commands'));

// 4. Client Ready & Auto-Registration
client.once(Events.ClientReady, async (c) => {
    console.log(`🚀 AstraEcho is online as ${c.user.tag}!`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('--- Registering Commands with Discord ---');
        const commands = client.commands.map(cmd => cmd.data.toJSON());
        
        await rest.put(
            Routes.applicationCommands('1517031078777327706'),
            { body: commands },
        );
        console.log(`✅ Successfully registered ${commands.length} commands.`);
    } catch (error) {
        console.error('❌ Registration Error:', error);
    }
});

// 5. Interaction Handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error!', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);

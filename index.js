const { Client, GatewayIntentBits, Collection, Events, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
require('dotenv').config();

// Web Server for Render/Uptime
const app = express();
app.get('/', (req, res) => res.send('AstraEcho is alive!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

client.commands = new Collection();

// Command Loader
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
            }
        }
    }
};
loadCommands(path.join(__dirname, 'commands'));

client.once(Events.ClientReady, async (c) => {
    console.log(`🚀 AstraEcho is online as ${c.user.tag}!`);
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        const commandsData = client.commands.map(cmd => cmd.data.toJSON());
        await rest.put(Routes.applicationCommands('1517031078777327706'), { body: commandsData });
        console.log(`✅ Successfully synced ${commandsData.length} commands.`);
    } catch (error) {
        console.error('❌ Registration Error:', error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    // 1. Handle Slash Commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            const msg = { content: 'There was an error!', ephemeral: true };
            interaction.replied || interaction.deferred ? await interaction.followUp(msg) : await interaction.reply(msg);
        }
    } 
    // 2. Handle Ticket Menu
    else if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
        const category = interaction.values[0];
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: ['ViewChannel'] },
                { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
                { id: interaction.client.user.id, allow: ['ViewChannel', 'SendMessages'] }
            ]
        });

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
            .setTitle('Support Ticket')
            .setDescription(`Hello ${interaction.user}, welcome to your support ticket regarding **${category}**. A staff member will be with you shortly.`)
            .setColor(0x0099ff);

        await channel.send({ embeds: [embed], components: [buttons] });
        await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
    } 
    // 3. Handle Buttons (Claim/Close)
    else if (interaction.isButton()) {
        if (interaction.customId === 'claim_ticket') {
            await interaction.reply({ content: `${interaction.user} has claimed this ticket.` });
        } else if (interaction.customId === 'close_ticket') {
            await interaction.reply({ content: 'Closing ticket in 5 seconds...' });
            setTimeout(() => interaction.channel.delete().catch(console.error), 5000);
        }
    }
});

client.login(process.env.TOKEN);

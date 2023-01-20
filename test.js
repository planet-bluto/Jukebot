const print = console.log
const fs = require('node:fs')
require('dotenv').config({ path: `${__dirname}/.env` })
const token = process.env['token']
const GUILD_ID = process.env['guild']
const CLIENT_ID = process.env['client']

const {MemberDB} = require("./jukedb.js")

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const { Client, IntentsBitField, Message, Collection, Events } = require('discord.js')
const client = new Client({ intents: Object.values(IntentsBitField.Flags) })



//// SLASH COMMAND SETUP ////

client.commands = new Collection()
const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    var commandJSON = JSON.stringify(command.data)
    commands.push(command.data)

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})

const rest = new REST({ version: '10' }).setToken(token)

async function registerSlashCommands() {
    try {
        print(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        print(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

registerSlashCommands()



//// DISCORD.JS INITIALIZE ////

client.on("ready", () => {
    print(`${client.user.username} Initialized!`)
})

client.login(token)
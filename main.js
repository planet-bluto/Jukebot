const print = console.log
const fs = require('node:fs')
require('dotenv').config({ path: `${__dirname}/.env` })
const token = process.env['token']
const GUILD_ID = process.env['guild']
const CLIENT_ID = process.env['client']
const WELCOME_CHANNEL = process.env['wchl']
const INFO_CHANNEL = process.env['ichl']
const ROLES_CHANNEL = process.env['rchl']
const WELCOME_EMOJI = process.env['emoji_w']

const {MemberDB, ChannelDB} = require("./jukedb.js")

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const { Client, IntentsBitField, ChatInputCommandInteraction, Collection, Events } = require('discord.js')
const client = new Client({ intents: Object.values(IntentsBitField.Flags) })



//// SLASH COMMAND SETUP ////

client.commands = new Collection()
const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    if (!file.startsWith("!")) {
        const command = require(`./commands/${file}`)
        var commandJSON = JSON.stringify(command.data)
        commands.push(command.data)

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        }
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

client.on("channelDelete", async (channel) => {
    let this_PC = await ChannelDB.get(channel.id)
    let user_id = this_PC.owner
    if (user_id) {
        MemberDB.orig_set(user_id, "channel", null)
        ChannelDB.remove(channel.id)
        let user = await client.users.fetch(user_id)
        user.send(`**‼ Your PC has been deleted! ‼**\n*(This is __permanent__ and cannot be undone)*`)
    }
})

client.on("guildMemberAdd", async (member) => {
    let channel = await client.channels.fetch(WELCOME_CHANNEL)
    channel.send(`${WELCOME_EMOJI} **Welcome, <@${member.id}>, to TheJukeBox Music Community!** ${WELCOME_EMOJI}\n*(Check out <#${INFO_CHANNEL}> for more information, or get your roles in <#${ROLES_CHANNEL}>)*`)
})

client.on("ready", async () => {
    print(`${client.user.username} Initialized!`)
})

client.on("messageCreate", msg => {
    print(msg.content)
})

client.login(token)
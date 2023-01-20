const print = console.log
require('dotenv').config({ path: `${__dirname}/.env` })
const token = process.env['token']

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const { Client, Intents, Message } = require('discord.js')
const client = new Client({ intents: Object.values(Intents.FLAGS) })

Message.prototype.safe_delete = function () {
	if (this.author.id == client.user.id || this.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
		this.delete()
	} else { return }
}
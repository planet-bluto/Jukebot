const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const JukeUtils = require("../jukeutils.js")

const COMMAND_INFO = {
	name: "testname",
	description: "Convert string to valid channel name"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addStringOption(option => option.setName("string")
	.setDescription("String to convert")
	.setRequired(true))

///////////////////////////////////////////

async function execute(interaction) {
	let str = interaction.options.get("string").value
	await interaction.reply({
		content: `__**\`\`Channel Name:\`\`**__\n${JukeUtils.validChannelName(str)}`,
		ephemeral: true
	})
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
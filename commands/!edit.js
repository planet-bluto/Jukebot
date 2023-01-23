const print = console.log
const { SlashCommandBuilder } = require('discord.js')

const COMMAND_INFO = {
	name: "edit",
	description: "Edit properties of PC (name, description, "
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

// command.addStringOption(option => option.setName("placeholder")
// 	.setDescription("this is a placeholder option"))

///////////////////////////////////////////

async function execute(interaction) {
	await interaction.reply("Pong!")
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
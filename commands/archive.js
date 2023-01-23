const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const AR_CAT_ID = process.env['acat']
const { MemberDB } = require("../jukedb.js")

const COMMAND_INFO = {
	name: "archive",
	description: "Archives current personal channel"
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
	let {user, channel} = interaction

	if (MemberDB.get(user.id, "channel") == channel.id) {
		await interaction.reply({
			content: "‼ **Archiving PC...** ‼",
			ephemeral: true
		})
		await channel.setParent(AR_CAT_ID)
		await user.send("‼ **Your PC has been archived.** ‼\n*(To undo this, use the ``/unarchive`` command on the server)*")
		await interaction.deleteReply()
	} else {
		await interaction.reply({
			content: "‼ **You don't have access to that command**",
			ephemeral: true
		})
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
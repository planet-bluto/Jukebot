const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const PC_CAT_ID = process.env['pcat']
const AR_CAT_ID = process.env['acat']
const { MemberDB } = require("../jukedb.js")

const COMMAND_INFO = {
	name: "unarchive",
	description: "Unarchives recently archived PC"
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
	await interaction.deferReply({ephemeral: true})
	let {user, client} = interaction
	let channel = await client.channels.fetch(MemberDB.get(user.id, "channel"))
	if (channel == null) {
		await interaction.editReply("‼ **Your PC doesn't exist or has been deleted** ‼")
	}
	if (channel.parent == AR_CAT_ID) {
		await channel.setParent(PC_CAT_ID)
		await interaction.editReply(`✅ **Your PC (<#${channel.id}>) has been restored!** ✅`)
	} else {
		await interaction.editReply("‼  **Your PC is not archived** ‼")
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
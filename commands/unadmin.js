const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const { MemberDB, ChannelDB } = require("../jukedb.js")
const PERMS = require("../perms.js")

const COMMAND_INFO = {
	name: "unadmin",
	description: "Removes an admin from your PC"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addUserOption(option => option.setName("member")
	.setDescription("User to remove admin")
	.setRequired(true))

///////////////////////////////////////////

async function execute(interaction) {
	var deferPromise = interaction.deferReply()

	let user = interaction.options.get("member").user
	let channel = interaction.channel

	let channelObj = await ChannelDB.get(channel.id)
	await deferPromise
	if (channelObj.admins.includes(user.id)) {
		var promPush = ChannelDB.pull(channel.id, "admins", user.id)
		var promEdit = interaction.editReply(`**🔨 <@${user.id}> is no longer an admin! 🔨**`)
		var promPerms = channel.permissionOverwrites.delete(user.id)
		await Promise.all([promPush, promEdit, promPerms])
	} else {
		await interaction.editReply(`**‼ ${user.username} is not an admin ‼**`)
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const { MemberDB, ChannelDB } = require("../jukedb.js")
const PERMS = require("../perms.js")

const COMMAND_INFO = {
	name: "admin",
	description: "Adds an admin to your PC"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addUserOption(option => option.setName("member")
	.setDescription("User to make admin")
	.setRequired(true))

///////////////////////////////////////////

async function execute(interaction) {
	var deferPromise = interaction.deferReply()

	let user = interaction.options.get("member").user
	let channel = interaction.channel

	let channelObj = await ChannelDB.get(channel.id)
	await deferPromise
	if (!channelObj.admins.includes(user.id)) {
		var promPush = ChannelDB.push(channel.id, "admins", user.id)
		var promEdit = interaction.editReply(`**🔨 <@${user.id}> is now an admin! 🔨**`)
		var promPerms = channel.permissionOverwrites.create(user.id, PERMS.OWNER.serialize())
		await Promise.all([promPush, promEdit, promPerms])
	} else {
		await interaction.editReply(`**‼ ${user.username} is already an admin ‼**\n*(Use \`\`/unadmin\`\` to remove an admin)*`)
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
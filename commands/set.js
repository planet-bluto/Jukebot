const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const { MemberDB } = require("../jukedb.js")
const PERMS = require("../perms.js")

const COMMAND_INFO = {
	name: "set",
	description: "(Server Admin Only) Sets someone's jukes balance"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addMentionableOption(option => option.setName('member')
	.setDescription("Who's bank account to set")
	.setRequired(true))

command.addStringOption(option => option.setName('type')
	.setDescription("Which type of currency to set")			
	.addChoices(
		choice("jukes"),
		choice("boxes")
	)
	.setRequired(true))

command.addNumberOption(option => option.setName('amount')
	.setDescription("Amount to set specified currency to")
	.setRequired(true))

command.setDefaultMemberPermissions(PERMS.ADMIN)

///////////////////////////////////////////

async function execute(interaction) {
	if (interaction.member.permissions.has(PERMS.ADMIN)) {
		await interaction.deferReply({ephemeral: true})

		let who = interaction.options.get("member")
		let type = interaction.options.get("type").value
		let amount = interaction.options.get("amount").value

		var whos = []
		var pre = ""
		if (who.role) {
			pre = "@&"
			whos = Array.from(who.role.members.values())
		} else {
			pre = "@"
			whos = [who.user]
		}

		var sets = []
		whos.forEach(async (user, u_i) => {
			sets.push(MemberDB.set(user.id, type, amount))
		})

		await Promise.all(sets)
		await interaction.editReply({
			content: `Set <${pre}${who.value}>'s ${type} balance to \`\`${amount}\`\``
		})
	} else {
		await interaction.reply("You don't have access to this command")
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
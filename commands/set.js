const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const COMMAND_INFO = {
	name: "set",
	description: "(Server Admin Only) Sets someone's jukes balance"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addUserOption(option => option.setName('member')
	.setDescription("Member's who bank account to set")
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

///////////////////////////////////////////

const { MemberDB } = require("../jukedb.js")
const PERMS = require("../perms.js")

async function execute(interaction) {
	if (interaction.member.permissions.has(PERMS.ADMIN)) {
		await interaction.deferReply()
		let user = interaction.options.get("member").user
		let type = interaction.options.get("type").value
		let amount = interaction.options.get("amount").value
		await MemberDB.set(user.id, type, amount)
		await interaction.editReply({
			content: `Set <@${user.id}>'s ${type} balance to \`\`${MemberDB.get(user.id, type)}\`\``
		})
	} else {
		await interaction.reply("You don't have access to this command")
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
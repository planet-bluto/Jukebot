const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const { MemberDB } = require("../jukedb.js")

const COMMAND_INFO = {
	name: "balance",
	description: "Displays a user balance!"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addUserOption(option => option.setName("member")
	.setDescription("Member who's balance to check"))

///////////////////////////////////////////

async function execute(interaction) {
	await interaction.deferReply()
	let member = interaction.options.get("member")
	let user = (member ? member.user : interaction.user )
	let jukes = MemberDB.get(user.id, "jukes")
	let boxes = MemberDB.get(user.id, "boxes")
	let res = await Promise.all([jukes, boxes])
	await interaction.editReply(`__**${user.username}**'s Balance:__\n\n🔴 Jukes: \`\`${res[0]}\`\`\n🔵 Boxes: \`\`${res[1]}\`\``)
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
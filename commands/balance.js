const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const { MemberDB } = require("../jukedb.js")
const JukeUtils = require("../jukeutils.js")

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
	let userDB = await MemberDB.get(user.id)
	let res = [userDB.jukes, userDB.boxes]
	await interaction.editReply(`__**${user.username}**'s Balance:__\n\n${JukeUtils.coinToEmote("jukes")} Jukes: **\`\`${res[0]}\`\`** ${JukeUtils.coinToEmote("jukes")}\n${JukeUtils.coinToEmote("boxes")} Boxes: **\`\`${res[1]}\`\`** ${JukeUtils.coinToEmote("boxes")}`)
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
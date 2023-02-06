const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const { MemberDB, ChannelDB } = require("../jukedb.js")
const UserCard = require('../cards/userCards.js')

const COMMAND_INFO = {
	name: "pc_info",
	description: "Tells you information about a PC"
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
	let channelObj = await ChannelDB.get(interaction.channel.id)
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
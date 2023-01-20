const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const COMMAND_INFO = {
	name: "channel",
	description: "Creates a personal channel [1,000 jukes]"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

// command.addStringOption(option => option.setName("placeholder")
// 	.setDescription("this is a placeholder option"))

///////////////////////////////////////////

const PC_CAT_ID = process.env['pcat']
const { MemberDB, canPurchase } = require("../jukedb.js")
const PERMS = require("../perms.js")

async function execute(interaction) {
	let {user} = interaction
	let PC_ID = MemberDB.get(user.id, "channel")
	let user_jukes = MemberDB.get(user.id, "jukes")
	let user_boxes = MemberDB.get(user.id, "boxes")
	if (MemberDB.canPurchase(user.id, 1000)) {print ("COULD")}
	if (PC_ID == null) {
		await interaction.deferReply()
		let this_pc = await interaction.guild.channels.create({
			parent: PC_CAT_ID,
			name: `${interaction.member.displayName}-pc`,
			permissionOverwrites: [
				{
					id: interaction.member.id,
					allow: [PERMS.OWNER]
				}
			]
		})
		MemberDB.sub(user.id, "jukes", 1000)
		MemberDB.set(user.id, "channel", this_pc.id)
		await interaction.editReply(`Your PC has been made! <#${this_pc.id}>`)
	} else {
		await interaction.reply("You can't own multiple PCs!!")
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
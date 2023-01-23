const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const PC_CAT_ID = process.env['pcat']
const AR_CAT_ID = process.env['acat']
const { MemberDB, canPurchase } = require("../jukedb.js")
const JukeUtils = require("../jukeutils.js")
const PERMS = require("../perms.js")

const COMMAND_INFO = {
	name: "channel",
	description: "Creates a personal channel"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addStringOption(option => option.setName("name")
	.setDescription("Name of your PC"))

///////////////////////////////////////////

async function execute(interaction) {
	let {user, client} = interaction
	let PC_ID = MemberDB.get(user.id, "channel")
	await interaction.deferReply({ephemeral: true})

	async function makePC() {
		let name_option = interaction.options.get("name")
		let channel_name = (name_option ? name_option.value : `${interaction.member.displayName}-pc`)
		let this_pc = await interaction.guild.channels.create({
			parent: PC_CAT_ID,
			name: channel_name,
			permissionOverwrites: [
				{
					id: interaction.member.id,
					allow: [PERMS.OWNER]
				}
			]
		})
		await MemberDB.set(user.id, "channel", this_pc.id)
		await interaction.editReply(`🎉 **Your PC has been made! <#${this_pc.id}>** 🎉\n*(You have permissions to edit the channel as you please!)*`)
	}

	if (PC_ID == null) {
		await makePC()
	} else {
		let this_pc = await client.channels.fetch(PC_ID)
		if (this_pc.parent.id == AR_CAT_ID) {
			// await Promise.all([DBupdate, PCdeletion])
			await makePC()
			await this_pc.delete()
		} else {
			await interaction.editReply({
				content: "‼ **You can't own multiple PCs!!** ‼\n*(You have to \`\`/archive\`\` your current one to make a new one)*",
				ephemeral: true
			})
		}
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
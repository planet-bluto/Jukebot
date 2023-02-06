const print = console.log
const { SlashCommandBuilder } = require('discord.js')
const { MemberDB } = require("../jukedb.js")
const JukeUtils = require("../jukeutils.js")
const PERMS = require("../perms.js")
const BADGES = require("../cards/badges.json")

const COMMAND_INFO = {
	name: "badge",
	description: "(Server Admin Only) Edit user badges"
}

const command = new SlashCommandBuilder()
command.setName(COMMAND_INFO.name)
command.setDescription(COMMAND_INFO.description)

//// Additional SlashCommand Arguments ////

const choice = (val) => {return {name: val, value: val}}

command.addMentionableOption(option => option.setName('member')
	.setDescription("Who's badges to edit")
	.setRequired(true))

command.addStringOption(option => option.setName('type')
	.setDescription("Change edit type")			
	.addChoices(
		choice("add"),
		choice("remove")
	)
	.setRequired(true))

let badgeChoices = Object.keys(BADGES).map((badge, i) => {
	return {name: badge, value: BADGES[badge]}
})

command.addStringOption(option => option.setName('badge')
	.setDescription("What badge to add or remove")			
	.addChoices(...badgeChoices)
	.setRequired(true))

command.setDefaultMemberPermissions(PERMS.ADMIN)

///////////////////////////////////////////

async function execute(interaction) {
	if (interaction.member.permissions.has(PERMS.ADMIN)) {
		await interaction.deferReply({ephemeral: true})

		let who = interaction.options.get("member")
		let type = interaction.options.get("type").value
		let badgeInd = interaction.options.get("badge").value

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
		whos.forEach((user, u_i) => {
			let prom = async () => {
				let userObj = await MemberDB.get(user.id)
				userObj.badges[badgeInd] = (type == "add")
				await MemberDB.set(user.id, "badges", userObj.badges)
				return true
			}
			sets.push(prom())
		})

		let thisText;
		if (type == "add") {
			thisText = `🟢🎖 **Gave the \`\`${badgeInd}\`\` badge to <${pre}${who.value}>** 🎖🟢`
		} else {
			thisText = `🔴🎖 **Removed the \`\`${badgeInd}\`\` badge from <${pre}${who.value}>** 🎖🔴`
		}

		await Promise.all(sets)
		await interaction.editReply({
			content: thisText
		})
	} else {
		await interaction.reply("You don't have access to this command")
	}
}

module.exports = {
	data: command.toJSON(),
	execute: execute
}
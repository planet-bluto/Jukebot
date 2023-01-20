const print = console.log
const { PermissionsBitField } = require('discord.js')
const DEFAULT = PermissionsBitField.Default

module.exports = {
	DEFAULT: DEFAULT,
	OWNER: PermissionsBitField.Flags["ManageChannels"],
	ADMIN: PermissionsBitField.Flags["Administrator"]
}
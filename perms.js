const print = console.log
const { PermissionsBitField } = require('discord.js')
const DEFAULT = PermissionsBitField.Default

const pf = (str) => PermissionsBitField.Flags[str]

module.exports = {
	DEFAULT: DEFAULT,
	OWNER: new PermissionsBitField([
		pf("ManageChannels"),
		pf("ManageWebhooks"),
		pf("ManageMessages"),
		pf("ManageRoles"),
		pf("ManageThreads")
	]),
	MANAGER: new PermissionsBitField([
		pf("ManageMessages"),
	]),
}
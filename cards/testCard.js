const print = console.log

//// Env
const GUILD_ID = process.env['guild']

//// Requires
const { createCanvas, registerFont, loadImage } = require('canvas')
const { MemberDB, ChannelDB } = require("../jukedb.js")

//// Fonts
registerFont('./cards/AtkinsonHyperlegible-Bold.ttf', { family: 'Big Card' })
registerFont('./cards/Comfortaa-Bold.ttf', { family: 'Mid Card' })

const canvas = createCanvas(1324, 827)
const ctx = canvas.getContext('2d')

Math.rad = (degrees) => {
  var pi = Math.PI;
  return degrees * (pi/180);
}

async function make(client, userId) {
	var guildObj = await client.guilds.fetch(GUILD_ID)
	var memberObj = await guildObj.members.fetch(userId)

	var userObjDB = await MemberDB.get(userId)

	var COLOR = "#024aca"

	//// Background Box
	ctx.fillStyle = COLOR
	ctx.beginPath()
	ctx.roundRect(58, 160, 1266, 667, 25)
	ctx.fill()

	// Template
	let templateImg = await loadImage("./cards/template.png")
	ctx.drawImage(templateImg, 0, 0)

	// Draw icon --- \/ \/ \/
	let memberIconURL = (memberObj.displayAvatarURL().replace("webp", "png") + "?size=300")
	let memberIconImg = await loadImage(memberIconURL)

	ctx.save()
	ctx.rotate(Math.rad(-6.72))
	ctx.beginPath()
	ctx.roundRect(0, 44.77, 382.38, 382.38, 48)
	ctx.clip()
	ctx.drawImage(memberIconImg, 0, 44.77, 382.38, 382.38)

	ctx.restore()

	ctx.strokeStyle = "#151515"
	ctx.lineWidth = 15
	ctx.stroke()

	// Name
	ctx.resetTransform()
	ctx.font = `76px "Big Card"`
	ctx.textBaseline = "middle"
	ctx.fillStyle = "white"
	ctx.fillText(memberObj.displayName, 81, (417+74))

	// Balance
	ctx.font = `36px "Mid Card"` // Jukes 
	ctx.textBaseline = "middle"
	let thisText = userObjDB.jukes
	let thisMaxWidth = 153.22
	let thisWidth = ctx.measureText(thisText).width
	ctx.fillStyle = "white"
	ctx.fillText(thisText, 144.37+((thisMaxWidth/2)-(thisWidth/2)), (562.67+(49.88/2)) )

	ctx.font = `36px "Mid Card"` // Boxes
	ctx.textBaseline = "middle"
	thisText = userObjDB.boxes
	thisMaxWidth = 153.22
	thisWidth = ctx.measureText(thisText).width
	ctx.fillStyle = "white"
	ctx.fillText(thisText, 388.12+((thisMaxWidth/2)-(thisWidth/2)), (562.67+(49.88/2)) )

	// Placings
	ctx.font = `36px "Mid Card"`
	ctx.textBaseline = "middle"
	ctx.lineWidth = 12
	ctx.strokeStyle = "#151515"
	ctx.strokeText("x1", 128, 767)
	ctx.fillStyle = "white"
	ctx.fillText("x1", 128, 767)

	ctx.quality = "best"

	return canvas.createPNGStream()
}

module.exports = make
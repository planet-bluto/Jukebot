const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(1324, 827)
const ctx = canvas.getContext('2d')

async function make() {
	//// Background Box
	let template = loadImage("./template.png")
	ctx.drawImage(template, 0,0)

	return ctx.toBuffer()
}

module.exports = {}
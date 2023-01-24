const print = console.log

const JUKE_EMOJI = process.env['emoji_j']
const BOX_EMOJI = process.env['emoji_b']

module.exports = {
	coinToEmote: (str) => {
		return {jukes: JUKE_EMOJI, boxes: BOX_EMOJI}[str.toLowerCase()]
	}
}
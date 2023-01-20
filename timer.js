class Timer {
	constructor() {
		this._start = Date.now()
	}

	since() {
		return (Date.now() - this._start)
	}
}

module.exports = Timer
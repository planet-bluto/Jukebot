const print = console.log
const token = process.env['dbpass']

const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://JukeBot:${dbpass}@jukebot.dk6angy.mongodb.net/?retryWrites=true&w=majority`)

class Sheet {
    constructor(name) {
        this.inited = false
        this._name = name
        this._events = []
    }

    _call(event, ...args) {
        if (this._events[event]) {
            this._events[event].forEach(callback => {
                callback(...args)
            })
        }
    }

    get(user, key) {

    }

    on(event, callback) {
        if (!Array.isArray(this._events[event])) {
            this._events[event] = []
        }
        this._events[event].push(callback)
    }

    async set(user, key, value) {

    }

    async add(user, key, value) {

    }

    async sub(user, key, value) {

    }

    has(key, value) {

    }
}

var MemberDB = new JukeDB("members")
MemberDB.purchase = async (user, type, amount) => {
    let balance = MemberDB.get(user, type)

    if (balance >= amount) {
        await MemberDB.sub(user, type, amount)
        return true
    } else {
        return false
    }
}

module.exports = { // JukeDB
    MemberDB: MemberDB,
}
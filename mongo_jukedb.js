const print = console.log
const database = process.env['dbpath']

const mongoose = require('mongoose')
mongoose.connect(database)

//// SCHEMAS ////

const pcSchema = new mongoose.Schema({
    id: String,
    owner: String,
    admins: [String],
    managers: [String],
    created: { type: Date, default: Date.now },
    likes: {
        type: Number,
        default: 0,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },
    special: {
        type: Boolean,
        default: false
    }
})

const memberSchema = new mongoose.Schema({
    id: String,
    jukes: {
        type: Number,
        default: 0,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },
    boxes: {
        type: Number,
        default: 0,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },
    PC: {
        type: String,
        default: null
    }
})

const PersonalChannel = mongoose.model('PersonalChannel', pcSchema)
const Member = mongoose.model('Member', memberSchema)

/////////////////



class JukeDB {
    constructor(model) {
        this.inited = false
        this._model = model
        this._events = []
    }

    _call(event, ...args) {
        if (this._events[event]) {
            this._events[event].forEach(callback => {
                callback(...args)
            })
        }
    }

    async get(user, key) {
        var return_val = null
        if (await this.has(user)) {
            let doc = await this._model.findOne({id: user})
            return_val = doc[key]
        }
        return return_val
    }

    on(event, callback) {
        if (!Array.isArray(this._events[event])) {
            this._events[event] = []
        }
        this._events[event].push(callback)
    }

    async set(user, key, value) {
        if (await !this.has(user)) {
            let doc = await this._model.create({id: user})
        }
            let update = {}
            update[key] = value
            return this._model.findOneAndUpdate({id: user}, update)
    }

    async add(user, key, value) {
        let oldVal = await this.get(user, key)
        return this.set(user, key, (oldVal+value))
    }

    async sub(user, key, value) {
        let oldVal = await this.get(user, key)
        return this.set(user, key, (oldVal-value))
    }

    async has(key) {
        let doc = await this._model.exists({id: key})
        return (doc != null && doc.id == key)
    }
}

var MemberDB = new JukeDB(Member)
var ChannelDB = new JukeDB(PersonalChannel)
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
    ChannelDB: ChannelDB
}
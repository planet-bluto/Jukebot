const print = console.log
const gsheetdb = require('gsheetdb')
const SHEET_ID = process.env['sheet']

const schemas = {
    members: [
        {type: "String", default: null}, // user_id
        {type: "Number", default: 0}, // jukes
        {type: "Number", default: 0}, // boxes
        {type: "String", default: null}, // channel_id
    ],
    channels: [
        {type: "String", default: null}, // channel_id
        {type: "String", default: null}, // owner
        {type: "Array", default: []}, // admins
        {type: "Array", default: []}, // managers
    ]
}

function wait(ms) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res()
        }, ms)
    })
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

const escapedChars = ["{", "}", "[", "]"]

function escape(str) {
    let newStr = str
    escapedChars.forEach(char => {
        newStr = newStr.replaceAll(char, "/"+char)
    })
    return newStr
}

function unescape(str) {
    let newStr = str
    escapedChars.forEach(char => {
        newStr = newStr.replaceAll("/"+char, char)
    })
    return newStr
}

var formatData = (data) => {
    // print(data)
    let returnObj = {}
    let headers = []
    data.forEach((row, ind) => {
        if (ind == 0) {
            headers = row.values
            returnObj._rowIndex = {}
            headers.forEach((header, h_ind) => {
                if (h_ind == 0) return;
                returnObj._rowIndex[header] = h_ind
            })
        } else {
            let this_key = ""
            row.values.forEach((value, v_ind) => {
                if (v_ind == 0) {
                    this_key = value
                    returnObj[this_key] = {
                        _index: row.rowNb,
                        returnData: {},
                        _rowData: row.values
                    }
                } else {
                    returnObj[this_key].returnData[headers[v_ind]] = value
                }
            })
        }
    })
    return returnObj
}

class Sheet {
    constructor(name) {
        this.inited = false
        this._name = name
        this._sheet = new gsheetdb({
            spreadsheetId: SHEET_ID,
            sheetName: name,
            credentialsJSON: require('./credentials.json')
        })
        this._updateData().then(() => {
            this.inited = true
            this._call("init")
        })
        this._events = []
    }

    async _updateData() {
        let data = await this._sheet.getData()
        this._data = formatData(data)
    }

    async get(user, key) {
        await this._updateData()
        let userObj = this._data[user]
        if (userObj != null) {
            let returnVal = userObj.returnData[key]
            if (returnVal == "{null}") { returnVal = null }
            return returnVal
        } else {
            return null
        }
    }

    on(event, callback) {
        if (!Array.isArray(this._events[event])) {
            this._events[event] = []
        }
        this._events[event].push(callback)
    }

    _call(event, ...args) {
        if (this._events[event]) {
            this._events[event].forEach(callback => {
                callback(...args)
            })
        }
    }

    async _pend() {
        const total_pends = 1
        var pendings = 0

        return new Promise((res, rej) => {
            var check = () => { pendings++; if(pendings == total_pends){ res() }}

            if (!this.inited) {
                this.on("init", () => { check() })
            } else { check() }
        })
    }

    async set(user, key, value) {
        await this._updateData()
        let userData = this._data[user]
        let valueInd = this._data._rowIndex[key]
        let valueType = (value == null ? "null" : schemas[this._name][valueInd])
        switch (valueType) {
            case "null":
                value = "{null}"
            break;
            case "Array":
                value = JSON.stringify(value)
            break;
            case "String":
                value = escape(value)
            break;
        }
        if (userData != null) {
            let newDataArray = userData._rowData
            newDataArray[valueInd] = value
            await this._sheet.updateRow(userData._index, newDataArray)
        } else {
            let newRowData = schemas[this._name].map(sch => sch.default)
            newRowData[0] = user
            newRowData[this._data._rowIndex[key]] = value
            await this._sheet.insertRows([newRowData])
        }
        await this._updateData()
    }

    async add(user, key, value) {
        await this._updateData()
        let userData = this._data[user]
        let newValue = (userData.returnData[key]+value)
        await this.set(user, key, newValue)
    }

    async sub(user, key, value) {
        await this._updateData()
        let userData = this._data[user]
        let newValue = (userData.returnData[key]-value)
        await this.set(user, key, newValue)
    }

    async has(key, value) {
        await this._updateData()
        var return_id = null

        Object.keys(this._data).forEach(obj_key => {
            if (!obj_key.startsWith("_")) { // skip lib keys
                let userObj = this._data[obj_key].returnData
                if (userObj[key] == value) {
                    return_id = obj_key
                }
            }
        })

        return return_id
    }
}

var MemberDB = new Sheet("members")
var ChannelDB = new Sheet("channels")
// MemberDB.purchase = async (user, type, amount) => {
//     let balance = MemberDB.get(user, type)

//     if (balance >= amount) {
//         await MemberDB.sub(user, type, amount)
//         return true
//     } else {
//         return false
//     }
// }

module.exports = { // JukeDB
    MemberDB: MemberDB,
    ChannelDB: ChannelDB,
}
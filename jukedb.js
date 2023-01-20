const print = console.log
const gsheetdb = require('gsheetdb')

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

var formatData = (data) => {
    // print(data)
    let returnObj = {}
    let headers = []
    data.forEach((row, ind) => {
        if (ind == 0) {
            headers = row.values
        } else {
            let this_key = ""
            row.values.forEach((value, v_ind) => {
                if (v_ind == 0) {
                    this_key = value
                    returnObj._rowIndex = {}
                    returnObj[this_key] = {
                        _index: row.rowNb,
                        returnData: {},
                        _rowData: row.values
                    }
                } else {
                    returnObj[this_key].returnData[headers[v_ind]] = value
                    returnObj._rowIndex[headers[v_ind]] = v_ind
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
            spreadsheetId: '1e8UHxlLCtxEdqTTdTa6rqvnvJ7FIiKq_ClFFIyaxmnA',
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

    get(user, key) {
        return this._data[user].returnData[key]
    }

    on(event, callback) {
        if (!Array.isArray(this._events[event])) {
            this._events[event] = []
        }
        this._events[event].push(callback)
        print(this._events[event])
    }

    _call(event, ...args) {
        this._events[event].forEach(callback => {
            callback(...args)
        })
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
        await this._pend()
        let userData = this._data[user]
        if (userData != null) {
            let valueInd = this._data._rowIndex[key]
            let newDataArray = userData._rowData
            newDataArray[valueInd] = value
            await this._sheet.updateRow(userData._index, newDataArray)
        } else {
            let newRowData = [user, 0, 0]
            newRowData[this._data._rowIndex[key]] = value
            await this._sheet.insertRows([newRowData])
        }
        await this._updateData()
    }

    async add(user, key, value) {
        let userData = this._data[user]
        let newValue = (userData.returnData[key]+value)
        await this.set(user, key, newValue)
    }

    async sub(user, key, value) {
        let userData = this._data[user]
        let newValue = (userData.returnData[key]-value)
        await this.set(user, key, newValue)
    }
}

module.exports = { // JukeDB
    MemberDB: new Sheet("members"),
}
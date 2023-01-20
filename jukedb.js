const print = console.log
const gsheetdb = require('gsheetdb')

var InitSheets = new Set()
var loadSheetCount = 0

function initSheet(name) {
    InitSheets.add(name)
    if (InitSheets.size == loadSheetCount) {
        events.call("init")
    }
}

const formatData = (data) => {
    print(data)
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
                    returnObj[this_key] = {
                        _index: row.rowNb,
                        returnData: {}
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
        loadSheetCount = 1
        this._name = name
        this._sheet = new gsheetdb({
            spreadsheetId: '1e8UHxlLCtxEdqTTdTa6rqvnvJ7FIiKq_ClFFIyaxmnA',
            sheetName: name,
            credentialsJSON: require('./credentials.json')
        })
        this._updateData()
    }

    _updateData() {
        this._sheet.getData().then(data => {
            this._data = formatData(data)
            initSheet(this._name)
        })
    }

    get(value) {
        return this._data[value].returnData
    }

    set(value, newValue) {
        this._updateData()
    }
}

var events = {
    call: (event, ...args) => {
        events[event].forEach(callback => {
            callback(...args)
        })
    }
}

var addEvent = (event, callback) => {
    if (!Array.isArray(events[event])) {
        events[event] = []
    }
    events[event].push(callback)
}

module.exports = { // JukeDB
    Jukes: new Sheet("jukes"),
    on: addEvent
}
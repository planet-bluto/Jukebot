const print = console.log
const JukeDB = require("./jukedb.js")

JukeDB.on("init", () => {
    print(JukeDB.Jukes.get("Blu"))
})
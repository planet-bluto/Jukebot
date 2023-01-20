const print = console.log
const {MemberDB} = require("./jukedb.js")
const Timer = require("./timer.js") // why did I make this uselessness???

MemberDB.on("init", async () => {
    await MemberDB.set("Karma", "Boxes", 2)
    print(MemberDB.get("Karma", "Boxes"))
})

// YIPPEE!!!
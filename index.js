// ====================================
// KRISH WHATSAPP MUSIC BOT
// CREATED BY KRISH X STAR
// PUBLIC SOURCE
// ====================================

const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const P = require("pino")
const fs = require("fs")
const config = require("./config")
const { downloadSong } = require("./downloader")

// =========================================
// OWNER PROTECTION SYSTEM
// CREATED BY KRISH X STAR
// =========================================

const MAIN_OWNER = "KRISH X STAR"

if (
  OWNER_NAME !== MAIN_OWNER ||
  BOT_NAME !== "RAIPUR MUSIC WORLD BOT"
) {
  console.log("====================================")
  console.log("❌ SECURITY ERROR DETECTED")
  console.log("❌ OWNER NAME CHANGED")
  console.log("❌ ACCESS DENIED")
  console.log("====================================")

  process.exit(1)
}

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState("session")

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const m = messages[0]

    if (!m.message) return

    const msg =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      ""

    const from = m.key.remoteJid

    if (!msg.startsWith(config.prefix)) return

    const args = msg.slice(1).trim().split(" ")
    const command = args.shift().toLowerCase()

    if (command === "ping") {
      await sock.sendMessage(from, {
        text: "✅ KRISH MUSIC BOT ONLINE"
      })
    }

    if (command === "play") {

      const query = args.join(" ")

      if (!query) {
        return sock.sendMessage(from, {
          text: "❌ Example: /play alan walker"
        })
      }

      await sock.sendMessage(from, {
        text: `🎵 Searching Song: ${query}`
      })

      try {

        const data = await downloadSong(query)

        if (!data) {
          return sock.sendMessage(from, {
            text: "❌ Song Not Found"
          })
        }

        await sock.sendMessage(from, {
          audio: fs.readFileSync(data.path),
          mimetype: "audio/mp4",
          ptt: false
        })

        fs.unlinkSync(data.path)

      } catch (e) {
        console.log(e)

        await sock.sendMessage(from, {
          text: "❌ Error While Downloading"
        })
      }
    }

  })

  console.log("================================")
  console.log(" KRISH WHATSAPP MUSIC BOT ")
  console.log(" CREATED BY @iwanthotpinkpussy ")
  console.log("================================")

}

startBot()

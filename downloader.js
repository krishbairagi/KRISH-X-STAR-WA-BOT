// ====================================
// MUSIC DOWNLOADER FILE
// CREATED BY KRISH X STAR
// OWNER USERNAME : @iwanthotpinkpussy
// ====================================

const yts = require("yt-search")
const ytdl = require("ytdl-core")
const fs = require("fs")

async function downloadSong(query) {
  const search = await yts(query)
  const video = search.videos[0]

  if (!video) return null

  const stream = ytdl(video.url, {
    filter: "audioonly"
  })

  const path = "song.mp3"

  const write = fs.createWriteStream(path)

  stream.pipe(write)

  return new Promise((resolve) => {
    write.on("finish", () => {
      resolve({
        title: video.title,
        path
      })
    })
  })
}

module.exports = {
  downloadSong
}

import ytdl from "ytdl-core"
import fs from "fs"
import { error } from "console"
import { resolve } from "path"
import { rejects } from "assert"

export const download = (videoId) =>
  new Promise((resolve, rejects) => {
    const videoURL = "https://www.youtube.com/shorts/" + videoId
    console.log("Realizando o download do vídeo:", videoId)

    ytdl(videoURL, { quality: "lowestaudio", filter: "audioonly" })
      .on("info", (info) => {
        const seconds = info.formats[0].approxDurationMS / 1000

        if (seconds > 60) {
          throw new Error("A duração deste vídeo é maior que 60 segundos!")
        }
      })
      .on("end", () => {
        console.log("Download do vídeo finalizado.")
        resolve()
      })
      .on(error, (error) => {
        console.log(
          "Não foi possivel fazer o download do vídeo. Detalhes do erro:",
          error
        )
        rejects(error)
      })
      .pipe(fs.createWriteStream("./tmp/audio.mp4"))
  })

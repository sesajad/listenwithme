
const express = require('express')
const { exec } = require('child_process')
const { unlink } = require('fs')

const app = express()
const port = process.env.PORT
const SECRET = process.env.SECRET

const SONGS_DIR = 'songs/'

const songs = {
    list: ['nothing'],
    add(x) {
        let cmd = `youtube-dl -i --extract-audio --audio-format mp3 --audio-quality 0 "${x}" -o ${SONGS_DIR}/${x}.mp3`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`error 17: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            console.log(`stdout: ${stdout}`)
            this.list.push(x)
            if (this.list.length > 2) {
                let oldest = this.list.shift()
                unlink(SONGS_DIR + oldest, (error) => {
                    if (error) console.log(`error 29: ${error.message}`)
                })
            }
        })
    },
    latest() {
        return this.list[this.list.length - 1]
    }
}

app.get('/healthz', (req, res) => res.send('Still Alive!'))

app.get('/inform', (req, res) => {
    if (req.query.secret == SECRET) {
        songs.add(req.query.id)
        res.send('ok')
    } else {
        res.status(403)
        res.send('you are a lier')
    }  
})
app.get('/latest', (req, res) => res.send(songs.latest()))
app.use('/', express.static('public'))
app.use('/songs', express.static('songs'))
app.listen(port, () => console.log(`app is listening at http://localhost:${port} with secret "${SECRET}"`))

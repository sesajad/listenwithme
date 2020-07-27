
const express = require('express')
const { exec } = require('child_process')
const { unlink } = require('fs')

const app = express()
const port = process.env.PORT
const SECRET = process.env.SECRET

const SONGS_DIR = 'songs/'

const songs = {
    list: [],
    lock: false,
    add(x) {
        if (this.lock)
            return false
            // todo handle this case
        this.lock = true
        let cmd_1 = `youtube-dl -i --extract-audio --audio-format mp3 --audio-quality 0 ${x} -o tmp.mp3`
        let cmd_2 = `cp tmp.mp3 ${SONGS_DIR}${x}.webm`
        exec(cmd_1, (error, stdout, stderr) => {
            if (error) {
                console.log(`error 19: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
            }
            console.log(`stdout: ${stdout}`)
            exec(cmd_2, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error 17: ${error.message}`)
                    return
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`)
                }
                console.log(`stdout: ${stdout}`)
                unlink('tmp.mp3', (error) => {
                    if (error) console.log(`error 36: ${error.message}`)
                })
                this.list.push(x)
                if (this.list.length > 2) {
                    let oldest = this.list.shift()
                    unlink(`${SONGS_DIR}${oldest}.mp3`, (error) => {
                        if (error) console.log(`error 29: ${error.message}`)
                    })
                }
                this.lock = false
            })
        })
    },
    latest() {
        if (this.list.length == 0)
            return 'nothing'
        else
            return `${SONGS_DIR}${this.list[this.list.length - 1]}.mp3`
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

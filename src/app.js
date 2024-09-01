import express, { json, urlencoded } from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.routes.js'
import { Server } from 'socket.io'

const app = express()
const PORT = 8080

app.use(json())
app.use(urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/", viewsRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const io = new Server(httpServer)

let messages = []

io.on('connection', socket => {
    console.log("Nuevo cliente conectado")

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })
})

const { WebSocketServer } = require ("ws")
const dotenv = require("dotenv")
dotenv.config()

const wss = new WebSocketServer({port: process.env.PORT || 8080})

wss.on("connection", function connection(ws){
    ws.on("error", console.error)

    ws.on("message", function message(data){
        console.log(data.toString())
        wss.clients.forEach((client) => client.send(data.toString()))
    })
    ws.send("Recebendo mensagem do servidor!")

    console.log("Client conected")

}) 
const WebSocket = require('ws')
const http = require("http")
const fs = require("fs")
let state = false
console.log(`服务运行在8005端口!`)
// 创建WebSocket服务 监听端口
const wss = new WebSocket.Server({ port: 8005 })

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('收到消息' + message)
    if (message === 'open') {
      state = true
      wss.broadcast(JSON.stringify({state}))
    } else if (message === 'close') {
      state = false
      wss.broadcast(JSON.stringify({state}))
    } else {
      wss.broadcast(JSON.stringify({state}))
    }
  })
})

http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/html"
  })
  response.write(fs.readFileSync("index.html"))
  response.end()
}).listen(8006)
console.log(`页面运行在8006端口!`)
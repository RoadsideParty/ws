const WebSocket = require('ws')
const server = new WebSocket.Server({ port: 8081 })
// 发送消息
// code 200成功 201失败 202心跳
function sendMsg(ws, options, req) {
    const msgItem = {
        data: {},
        msg: '',
        code: 201
    }
    const msg = JSON.stringify({ ...msgItem, ...options })
    ws.send(msg)
}
// 接收消息
// code 300文本 400心跳
function getMsg(ws, req) {
    ws.on('message', msg => {
        const strMsg = JSON.parse(msg.toString())
        if (!strMsg.code) return
        if (strMsg.code === 400) {
            sendMsg(ws, { msg: strMsg.msg, code: 202 }, req)
        }
        if (strMsg.code === 300) {
            sendMsg(ws, { msg: strMsg.msg, code: 200 }, req)
        }
    })
}
// 断开连接
function close() {
    server.on('close')
}
server.on('connection', (ws, req) => {
    sendMsg(ws, { code: 200, msg: '连接成功' })
    getMsg(ws, req)
})
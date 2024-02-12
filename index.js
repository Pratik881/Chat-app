const express=require('express')
const app=express()
const http=require('http')
const { emit } = require('process')
const server=http.createServer(app)
const {Server}=require('socket.io')
const io=new Server(server)
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index1.html')
})
io.on('connection',(socket)=>{
    console.log('a user is connected',socket.id);
    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id)
    })
    socket.on('chat message',(msg)=>{
        
        console.log('message is', msg.msg)
        io.emit('chat message',msg)
    })
    socket.on('user_typing',(socket_id)=>{
      io.emit('user_typing',socket_id)
    })
    socket.on('stopped_typing',(socket_id)=>{
        io.emit('stopped_typing',socket_id)
    })
})
server.listen(3000,()=>{
    console.log('I am listening on port: 3000')
})
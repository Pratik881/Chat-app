const express=require('express')
const app=express()
const http=require('http')
app.use(express.static('Public'))
const { emit } = require('process')
const server=http.createServer(app)
const {Server}=require('socket.io')
const io=new Server(server)
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/Public/index1.html')
})
const onlineUsers={}
let messages=[]
io.on('connection',(socket)=>{
    console.log('a user is connected',socket.id);
    socket.on('user_connect',(username)=>{
        socket.emit('previous_messages',messages)
        onlineUsers[socket.id]=username;
        io.emit('update_online_users',Object.values(onlineUsers))
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id)
        delete onlineUsers[socket.id];
        io.emit('update_online_users',Object.values(onlineUsers))
    }) 
    socket.on('chat message',(msg)=>{
        
        console.log('message is', msg.msg)
        messages.push(msg)
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
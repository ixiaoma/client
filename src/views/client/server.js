//搭建网络服务
var express = require("express");
var app = express();

app.use(express.static("public"))
app.get("/",function(req,res){
    res.send("hello")
})
app.listen(80,function(){
    console.log("server run at 10.9.151.16")

})
//2 搭建服务器端的socket
var io = require("socket.io").listen(8080);
var users = {}
var number = 1
// 当 有人链接的时候
io.on("connection",function(socket){
    //console.log(socket)
    //socket  连接的用户的信息对想
    console.log("有人连接了");
    var ip = socket.client.conn.remoteADDress;
    //判断当前连接的用户
    if(!users[ip]){
        users[ip] = {
            username:"皮皮虾"+number++,
            imgUrl:"img/4.jpg"
        }
    }
    console.log(1)
    //发送
    socket.send({
        msg:"hello",
        userInfo:{
            username:"皮皮虾",
            imgUrl:"img/4.jpg"
        }
    })
    //接收
    socket.on("message",function(msg){
        console.log(msg)
        //需要吧接收到消息广播给所有人
        socket.broadcast.send({
            userInfo:users[ip],//把用户信息和消息都广播出去
            msg
        })
    })  
    // 监听改名的事件
    socket.on("changeName",function(newName){
        //在users 里面通过ip修改自己
        users[ip].username = newName;
    })
    // 监听 改头像
     socket.on("changePic",function(newPic){
        //在users 里面通过ip修改自己
        users[ip].imgUrl = newPic;
    })
})

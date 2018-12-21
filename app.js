var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// express处理静态资源
// 把public目录设置为静态资源目录
app.use(require('express').static('public'));//若无此段代码js、css文件无法加载

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

let users = [];//记录所有登录用户的数据
const TYPE_ENTER = 0;
const TYPE_LEAVE = 1;
const TYPE_MSG = 2;

io.on('connection', function (socket) {
    socket.on('login', (data) => {
        // console.log('data', data);
        if (users.some(item => item.username === data.username)) {
            // 登录失败(已登录过，给登录用户一个登录失败的提示)
            socket.emit('loginError', '用户已登录');
        } else {
            // 登录成功(将登录用户数据添加到users数组中，给登录用户一个成功的提示，给所有人广播)
            socket.emit('loginSuccess', data);
            users.push(data);
            io.emit('addUser',data);
            io.emit('userList',users);
            socket.username = data.username;
            socket.avatar = data.avatar;
            // socket.on('login', (username) => {
            //     io.emit('login', {
            //         type: TYPE_ENTER,
            //         msg: `${username}进入了聊天室`,
            //         time: new Date().toLocaleTimeString()
            //     })
            // })

        }

    })
    socket.on('sendMsg', data => {
        // console.log('sendMsg',data);
        io.emit('receiveMsg', {
            username: data.username,
            avatar: data.avatar,
            msg: data.msg
        })
        
    })
    socket.on('sendImg', data => {
        // console.log('sendMsg',data);
        io.emit('receiveImg', {
            username: data.username,
            avatar: data.avatar,
            img: data.img
        })
        
    })
    socket.on('disconnect', function () {
        // 在users中删除当前用户
        const idx = users.findIndex(item => item.username === socket.username);
        users.splice(idx,1);
        io.emit('delUser', {
            username: socket.username,
            avatar: socket.avatar
        });
        io.emit('userList',users);
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});
$(function () {
    const socket = io();
    const TYPE_ENTER = 0;
    const TYPE_LEAVE = 1;
    const TYPE_MSG = 2;
    let username = '';
    let avatar = '';
    $('#login_avatar li').on('click', function () {
        // console.log('this',this);
        // 此处使用箭头函数，this不会指向当前点击的元素
        $(this).addClass('now').siblings().removeClass('now');
    })
    $('#loginBtn').on("click", () => {
        const username = $('#username').val();
        // console.log('username',username);
        const avatar = $('#login_avatar li.now img').attr('src');
        socket.emit('login', { username, avatar });

    })
    $('#btn-send').on('click', () => {
        const msg = $('#content').text();
        // console.log('msg',msg);

        socket.emit('sendMsg', {
            username,
            avatar,
            msg
        })
        $('#content').text('');
    })
    //网页版微信选中图片及发送  不需要enter键
    $('#file').on('change', function() {
        const file = this.files[0];
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = function() {
            socket.emit('sendImg', {
                username,
                avatar,
                img: fr.result
            })
        }
    })

    socket.on('loginSuccess', (data) => {
        // console.log('loginSuccess', data);
        $('login_box').fadeOut();
        $('.container').fadeIn();
        $('.avatar_url').attr('src', data.avatar);
        $('.user-list .username').text(data.username);
        username = data.username;
        avatar = data.avatar;
    })
    socket.on('loginError', (data) => {
        alert('loginError', data);
    })
    socket.on('addUser', (data) => {
        $('.box-bd').append(`<div class="system">
        <p class="message_system">
          <span class="content">${data.username}加入了群聊</span>
        </p>
      </div>`)
      $('.box-bd').children(':last').get(0).scrollIntoView(false);
    })
    socket.on('userList', data => {
        console.log('data', data);
        $('.user-list ul').html('');//清空之前添加的用户
        data.forEach(item => {
            $('.user-list ul').append(`
            <li class="user">
              <div class="avatar"><img src="${item.avatar}" alt="加载中" /></div>
              <div class="name">${item.username}</div>
            </li>
            `)
        });

        $('#userCount').text(data.length);
    })
    socket.on('delUser', data => {
        // console.log('data', data);

        $('.box-bd').append(`<div class="system">
        <p class="message_system">
          <span class="content">${data.username}离开了群聊</span>
        </p>
      </div>`)
      $('.box-bd').children(':last').get(0).scrollIntoView(false);
    })
    socket.on('receiveMsg', data => {
        console.log('receiveMsg', data);

        if (username === data.username) {
            $('.box-bd').append(`<div class="message-box">
            <div class="my message">
              <img class="avatar" src="${data.avatar}" alt="" />
              <div class="content">
                <div class="bubble">
                  <div class="bubble_cont">${data.msg}</div>
                </div>
              </div>
            </div>
          </div>`)
            // $('.message-box .my img').attr('src', data.avatar);
            // $('.message-box .my .bubble_cont').text(data.msg);
        } else {
            $('.box-bd').append(`<div class="message-box">
            <div class="other message">
              <img class="avatar" src="${data.avatar}" alt="" />
              <div class="content">
                <div class="nickname">${data.username}</div>
                <div class="bubble">
                  <div class="bubble_cont">${data.msg}</div>
                </div>
              </div>
            </div>
          </div>`)
            // $('.message-box .other img').attr('src', data.avatar);
            // $('.message-box .other .bubble_cont').text(data.msg);
        }

        $('.box-bd').children(':last').get(0).scrollIntoView(false);
    })
    socket.on('receiveImg', data => {
        console.log('receiveImg', data);

        if (username === data.username) {
            $('.box-bd').append(`<div class="message-box">
            <div class="my message">
              <img class="avatar" src="${data.avatar}" alt="" />
              <div class="content">
                <div class="bubble">
                  <div class="bubble_cont">
                    <img src="${data.img}" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>`)
            // $('.message-box .my img').attr('src', data.avatar);
            // $('.message-box .my .bubble_cont').text(data.msg);
        } else {
            $('.box-bd').append(`<div class="message-box">
            <div class="other message">
              <img class="avatar" src="${data.avatar}" alt="" />
              <div class="content">
                <div class="nickname">${data.username}</div>
                <div class="bubble">
                  <div class="bubble_cont">
                    <img src="${data.img}" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>`)
            // $('.message-box .other img').attr('src', data.avatar);
            // $('.message-box .other .bubble_cont').text(data.msg);
        }

        $('.box-bd').children(':last').get(0).scrollIntoView(false);
    })
})

// socket.addEventListener('message', function (e) {
//     // console.log('Message from server ', e.data);
//     // msg.innerHTML = event.data;//接收服务器的数据在msg中展示

//     //每次接收服务器的数据追加到msg中
//     const dv = document.createElement('div');
//     let obj = JSON.parse(e.data);
//     // console.log('obj',obj);

//     dv.innerHTML = `${obj.msg}---${obj.time}`;
//     let n = obj.type;

//     switch (n) {
//         case 0:
//             dv.style.color = "green";
//             break;
//         case 1:
//             dv.style.color = "red";
//             break;
//         case 2:
//             dv.style.color = "#000";
//     }
//     msg.appendChild(dv);
// });
// socket.addEventListener('close', (e) => {
//     console.log('e', e);
//     // msg.innerHTML = '服务断开了连接'

// })
var socket = io();
var message = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var typingMessage = document.getElementById('typingMessage');
var onlineUsers = document.getElementById('online-users');
let person = prompt("Please enter your name", "Harry Potter");
socket.emit('user_connect', person);
input.onfocus = () => {
    socket.emit('user_typing', person);
};

socket.on('user_typing', (msg) => {
    typingMessage.textContent = `${msg} is typing`;
});

input.onblur = () => {
    socket.emit('stopped_typing', person);
};

socket.on('stopped_typing', (msg) => {
    typingMessage.textContent = `${msg} stopped typing`;
    setTimeout(() => {
        typingMessage.textContent = '';
    }, 5000);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', { person: person, msg: input.value });
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    var item = document.createElement('li');
    item.textContent = `${msg.person}: ${msg.msg}`;
    message.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('update_online_users', (users) => {
    onlineUsers.innerHTML = '<strong>Online Users:</strong><br>';
    users.forEach(user => {
        onlineUsers.innerHTML += `${user}<br>`;
    });
});

// const socket = io("http://localhost:8000", {
//   withCredentials: true // Ensures credentials are sent if needed
// });

const socket=io('http://localhost:8000');

const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp')
const messageContainer=document.querySelector(".container")


const append=(message,position)=>{
const mesele=document.createElement('div');
mesele.innerText=message;
mesele.classList.add('message');
mesele.classList.add(position);
messageContainer.append(mesele);
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value ;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';

})

const nameyou = prompt("Enter your name to join");
socket.emit('new-user-joined',nameyou);



socket.on('user-joined',nameyou=>{
append(`${nameyou} joined the chat`,'right')
})

socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'left')
})

socket.on('left',name=>{
    append(`${name} left the chat`,'right');
})
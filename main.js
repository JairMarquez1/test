function start(){    
    if(localStorage.getItem('chat') === null) {
        conversacion = 'Bot: Hola en que puedo ayudarte'
    }
    else{
        conversacion = localStorage.getItem('chat'); 
        displayChat(conversacion.split('\n'));
    }
}

function sendMessage(texto){
    updateChat(texto,0)
    conversacion += '\nCliente: ' + texto + '\nBot: ';
    console.log(conversacion)
    fetch('http://54.167.124.92:3000/reply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'msg': conversacion })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json)
            conversacion += json.resp
            console.log(conversacion)
            updateChat(json.resp,1)
            localStorage.setItem('chat', conversacion)
        });
    document.getElementById('msg-input').value = ""
}

function updateChat(msg, user){
    if (user === 0){
    document.getElementById('messages').innerHTML+= 
        `<div class='client-message'><p>${msg}</p></div>`
    }
    else{
        document.getElementById('messages').innerHTML+= 
        `<div class='bot-message'><p>${msg}</p></div>`
    }
}

function displayChat(chat){
    chat.forEach(msg => {
        text = msg.substring(msg.indexOf(":") + 2);
        user = msg[0].toLowerCase()==='c'?0:1
        updateChat(text,user)
    });
}

function restart(){
    if (confirm("¿Desear reiniciar la conversación?")){
        localStorage.setItem('chat', null)
        conversacion = 'Bot: Hola en que puedo ayudarte'
        document.getElementById('messages').innerHTML = ''
    }
}

function send(){
    sendMessage(document.getElementById('msg-input').value)
}

document.addEventListener('keyup', (e) => {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key === 13)
      sendMessage(document.getElementById('msg-input').value)
});

start();
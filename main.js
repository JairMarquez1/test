function start(){   
    if(localStorage.getItem('chat') === null)
        conversacion = '{"role":"assistant", "content":"Hola, ¿en que puedo ayudarte?"},\n'
    else
        conversacion = localStorage.getItem('chat'); 
    displayChat(conversacion.split(',\n'));
}

function sendMessage(texto){
    updateChat(texto,0)
    conversacion += '{"role":"user", "content":"'+ texto + '"},\n';
    console.log(conversacion)
    fetch('http://localhost:443/reply', { //54.167.124.92
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
            mystr = (JSON.stringify(json) + ",")
            conversacion += (mystr + "\n")
            updateChat(json.content,1)
            localStorage.setItem('chat', conversacion)
        });
    document.getElementById('msg-input').value = ""
}

function updateChat(msg, user){
    //msg = msg.replaceAll('Hola, ¿en que puedo ayudarte?', `${time}, ¿en que puedo ayudarte?`)
    //msg = msg.replaceAll(/\{ubicaci.n\}/g, 'Calle de la Noche 2440, Guadalajara, Jalisco 44520, MX')
    if (user === 0){
    document.getElementById('messages').innerHTML+= 
        `<div class='client-message'><p>${msg.replaceAll('\n','<br>')}</p></div>`
    }
    else{
        document.getElementById('messages').innerHTML+= 
        `<div class='bot-message'><p>${msg.replaceAll('\n','<br>')}</p></div>`
    }
}

function displayChat(chat){
    console.log(chat)
    chat.slice(0, -1).forEach(msg => {
        msg = JSON.parse(msg)
        text = msg.content
        user = msg.role==='user'?0:1
        updateChat(text,user)
    });
}

function restart(){
    if (confirm("¿Deseas reiniciar la conversación?")){
        localStorage.removeItem('chat')
        conversacion = '{"role":"assistant", "content":"Hola, ¿en que puedo ayudarte?"},\n'
        document.getElementById('messages').innerHTML = ''
        displayChat(conversacion.split(',\n'));
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
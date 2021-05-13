// ya que en el index.html agregamos antes el script de socket.io, ese codigo ya escrito nos proporciona de esta funcion io() a el codigo

// agregar nueva conexion y guardarla en una constantle y esta variable la podemos usar en el backend pasandola como argumento en la funcion io.on() y esta sería
// la socket del usuario
const socket = io('http://localhost:3000')  //se pueden agregar aparte mas paths, de nuestro servidor ej. localhost:3000/api/chat


// DOM elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');


/* -----------------------------------------------------------------

emit  -  emite datos osea envia datos a traves del evento que se crea
on    -  escucha esos datos del evento que se creo con el emit

----------------------------------------------------------------- */


// Enviar evento con datos usando el emit al presionar el boton
btn.addEventListener('click', function() {
    
    // enviar los valores de los inputs al servidor en un objeto, a traves de  socket.emit() que se encarga de emitir datos, a traves de un evento que creamos llamado 'chat:message' (puede ser cualquier nombre)
    socket.emit('chat:message', {
        username: username.value,
        message: message.value, 
    })
    
    // imprimit en consola esos valores de inputs
    console.log({
        username: username.value,
        message: message.value, 
    });

    // borrar input message
    message.value = '';

})

// Enviar dato (username.value (que es del input) ) al servidor si alguien esta escribiendo
message.addEventListener('keypress', function(){
    console.log(username.value)
    socket.emit('chat:typing', username.value); //nuevo evento enviado al servidor que envia de dato el username
})

// recibir los datos (mensajes) del servidor usando el on para imprimirlos en pantalla
socket.on('chat:server', function (data) {

    console.log(data)

    actions.innerHTML = ''; //borrar el mensaje de typing cuando ya se mande el mensaje

    // html en los elementos que optuvimos por su id
    output.innerHTML += `<p>
        <strong> ${data.username} </strong>: ${data.message}
    </p>`
})

// recibir los datos (username cuando esta typiando) del servidor usando el on
socket.on('chat:typing-server', function(data) {

    actions.innerHTML = `<p> <em> ${data} is typing </em> </p>`
});
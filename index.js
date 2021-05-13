const express = require('express')
const app = express()
const path = require('path')

const SocketIO = require('socket.io')
/* -----------------------------------------------------------------

emit  -  emite datos osea envia datos a traves del evento que se crea
on    -  escucha esos datos del evento que se creo con el emit

----------------------------------------------------------------- */


// settings  :
app.set('port', process.env.PORT || 3000)


// static files  :
// console.log(path.join(__dirname, 'public')) //__dirnmae es el path en donde esta nuestra carpeta de proyecto, ahora le agregamos la otra carpeta public con el join para estar posicionados en la carpeta public
app.use(express.static(path.join(__dirname, 'public'))); //para que en el localhost:3000 en el navegador nos muestre lo que tenemos en la carpeta public


// start the server and save it on a const so whe can use it on socketIO.liste() :
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
})

// -------------------
// WEBSOCKETS
// -------------------

const io = SocketIO(server)

// cuando alguien se conecte, la variable socket hacer referencia al socket del usuario que se conecto
io.on('connection', (socket) => {
    console.log('new connection', socket.id)

    //evento creado en el frontend que le dimos como nombre 'chat:message', y el argumento data son los datos que se pasaron del frontend cuando creamos este evento
    socket.on('chat:message', (data) => {

        console.log(data)

        // ahora que ya tenemos los datos hay dos posibilidades que son: o enviar este mensaje a todos los usuarios que estan en el servidor incluyendome, o enviarlo a todos menos a mi mismo


        // incluyendome:
        // ------------
        // crear nuevo evento llamado message:server (puede ser cualquier nombre) y como segundo argumento le pasamos la data que estamos recibiendo en la funcion
        // y este io.sockets.emit() se encarga de mandar esta data a todos los navegadores que esten en el servidor
        io.sockets.emit('chat:server', data);

    })

    // No incluyendome:
    // ----------------
    // evento creado en el frontend que envia como dato el username cuando alguien esta escribiendo
    socket.on('chat:typing', (data) => {

        socket.broadcast.emit('chat:typing-server', data)

    })
})
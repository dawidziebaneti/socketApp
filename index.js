const express = require('express');

const server = function (port) {
    const app = express();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
    });

    io.on('connection', function(socket){
        console.log('a user is connected on port ' + port);

        socket.on('disconnect', function(){
            console.log('user disconnected from port ' + port);
        });

        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
        io.emit('start', port);

    });

    http.listen(port, () => console.log("Server listening at http://%s:%s",
        "localhost", port))
    return io;
}


const io1 = server(3000);
const io2 = server(3001);

setInterval(function () {
    io1.emit('chat message', 'ping');
    io2.emit('chat message', 'ping');
}, 5000)
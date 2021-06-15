var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 



var serialport = require("serialport");
var SerialPort = serialport.SerialPort;


app.use(express.static(__dirname + '/')); //Significa que estamos en el main path del proyecto

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});

//Serialport


/*serialport.list(function (err, ports) {

    ports.forEach(function(port) {
    console.log(port.comName);
    });
});*/


var sp = new  serialport(
    'COM11',
    {baudRate: 9600,
    databits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    });
//const parser = new serialport.parsers.Readline();
//port.pipe(parser);
    
var datos;

    
io.on('connection', function(socket){
    console.log("Nueva Conexión por sockets");
    var connectedUsersCount = io.engine.clientsCount;
    console.log("Numero de players: " + connectedUsersCount);
    //oneUserLeft = connectedUsersCount - 1;
    //io.emit('connectedUsersCount', connectedUsersCount);
    //socket.on('disconnect', oneUserLeft);
      sp.on('data', function(data) {
         console.log('data serial received: ' + data);

         datos = data;

           // socket.emit('llegaDeSerial', {text: datos.toString('utf8') });
           socket.emit('llegaDeSerial', datos.toString('utf8'));
        });

     



  });

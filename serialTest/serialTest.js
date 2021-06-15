var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 



app.use(express.static(__dirname + '/')); //Significa que estamos en el main path del proyecto

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});



//Serial
const serialPort = require('serialport');
const port = new serialPort(
		'COM13',
		{baudRate: 9600}
);

//var dato1 = 5;

const parser = new serialPort.parsers.Readline();
port.pipe(parser);
//const string = "foo";
const substringC = "C";
const substringSP1 = "SP1";
const substringSP2 = "SP2";

parser.on('data', (line) =>{
	console.log(line);
	//dato1 = line;
	


	// if(line.includes(substringC)){
	// 	console.log("El paquete recibido es del container");
	// }if(line.includes(substringSP1)){
	// 	console.log("El paquete recibido es del SP1")
	// }if(line.includes(substringSP2)){
	// 	console.log("El paquete recibido es del SP2")
	// }

	io.emit('llegaDeSerial', line);
	//para enviar...

    



});

// $(document).ready(function(){
// 	$("#demo").html(dato1);

// });

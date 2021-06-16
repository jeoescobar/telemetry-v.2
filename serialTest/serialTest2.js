var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 
var mqtt = require('mqtt');

const passwordC='Wiasfosa232!';
const usernameC='2092';

app.use(express.static(__dirname + '/')); //Significa que estamos en el main path del proyecto

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});


//Cliente MQTT
var clientMQTT  = mqtt.connect('mqtt://cansat.info:1883', {
                              username: usernameC, 
                              password: passwordC
});

clientMQTT.on('error', function (error) {
	console.log(error);
});

clientMQTT.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
});

//Serial
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

//to/from csv
var fs = require('fs');
var csvRead = require('csv-parser');
var json2csv = require('json2csv').parse;

var newLine = '\r\n';
var i = 0;
var k = 0;
var results = [];





var sp = new  serialport(
    'COM8',
    {
    baudRate: 115200,
    databits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    buffersize: 16384	
});
//const parser = new serialport.parsers.Readline();
//port.pipe(parser);
var datos;
var datosString;
var stringContainer;
var altitudFila1csv;
var enableSim=false;
var activateSim =false;

    
//sp.on('open', function() {
//	console.log('open');
//datosString = "SP1_ON,SP2_ON,20,20,2092,12:13:43,13,C,S,SP1_ON,SP2_ON,20,20,50,12:13:43,93.323243,75.234323,450,5,OK,45,50,CMDECHO,2097,12:13:43,13,S2,30,25,340,2097,12:13:43,13,S2,30,";
//console.log(datosString);

 
//Send to MQTT
clientMQTT.on('connect', function () {
	console.log('Connected');
	clientMQTT.subscribe('teams/2092');





io.on('connection', function(socket){
        console.log("New connection is detected...");
        var connectedUsersCount = io.engine.clientsCount;
        console.log("Number of users connected: " + connectedUsersCount);
        //oneUserLeft = connectedUsersCount - 1;

        socket.on("startMissionSocket", function(data){
        	console.log(data);///start command

			console.log("PRENDE LED");
			//sp.write("CMD,2092,CX,ON");
			sp.write("start");
        });
        socket.on("endMissionSocket", function(data){
        	console.log(data);///start command

			console.log("APAGA LED");
			//sp.write("CMD,2092,CX,OFF");
			sp.write("end");

        });
        socket.on("importMissionSocket", function(data){
        	console.log(data);///start command

			console.log("IMPORTA .CSV FILE");
			sp.write("import");
			//Import Data
			fs.createReadStream('flight19v2.csv')
			.pipe(csvRead({}))
			.on('data', (data) => results.push(data))
			.on('end', () => {
				
		        
		        console.log(results);
		       
		        console.log("csv file imported succesfully...");
		         
			});

        });

        socket.on("enableMissionSocket", function(data){
        	
        	//console.log(data);
        	
        		sp.write("enable");	//CMD,2092,SIM,ENABLE		
				console.log("Enable was pressed...");
				enableSim = true;
        	
        });

        socket.on("activateMissionSocket", function(data){
        	
        	//console.log(data);
        	
        		//sp.write(stringAltitud);
				sp.write("activate"); //CMD,2092,SIM,ACTIVATE
				console.log("Activate was pressed...");
				activateSim =true;
        	
        });
		
		socket.on("timeMissionSocket", function(data){
        	
    		//sp.write(stringAltitud);
			
			console.log("Set Time was pressed...");
			var time = new Date();
			//console.log(time.getUTCHours());
			//console.log(time.getUTCMinutes());
			//console.log(time.getUTCSeconds());

			time = time.getUTCHours() + ":" + time.getUTCMinutes() + ":" + time.getUTCSeconds();
			console.log(time);
			//sp.write("CMD,2092,ST,time"); //CMD,2092,ST,TIME
			
    	
        });




    	//sp.write("")    

		sp.on('data', function(data) {
			
			sleep(900);
			//console.log(results[k].Column1);

			var columna1altitud0 = results[0].Column1;
			var columna2altitud0 = results[0].Column2;
			var columna3altitud0 = results[0].Column3;
			var columna4altitud0 = results[0].Column4;
			var stringAltitud0 = columna1altitud0;
			stringAltitud0 += ",";
			stringAltitud0 += "2092";
			stringAltitud0 += ",";
			stringAltitud0 += columna3altitud0;
			stringAltitud0 += ",";
			stringAltitud0 += columna4altitud0;



			var columna1altitud = results[k].Column1;
			var columna2altitud = results[k].Column2;
			var columna3altitud = results[k].Column3;
			var columna4altitud = results[k].Column4;
			var stringAltitud = columna1altitud;
			stringAltitud += ",";
			stringAltitud += "2092";
			stringAltitud += ",";
			stringAltitud += columna3altitud;
			stringAltitud += ",";
			stringAltitud += columna4altitud;
			console.log(stringAltitud);


			if(enableSim ){//sólo envía el primer dato del simulador
				//sp.write(stringAltitud0);
				console.log("Enable was pressed...sending only first simulated pressure packet");

			}
			if(activateSim){
				enableSim =false;
				//sp.write(stringAltitud);
				//sp.write("enable");			
				console.log("Enable and activate were pressed...sending all simulated pressure packets");
				//enableSim = false;
			}
			

			//console.log(data);
			datosString = data.toString('utf8');
			//datosString = "2092,12:13:43,13,C,S,SP1_ON,SP2_ON,20,20,50,12:13:43,93.323243,75.234323,450,5,OK,45,50,CMDECHO";
			//console.log(datosString); 

			var res = datosString.split(",");
			//console.log("Lo primero que llega es: " + res[0]);


			
			var nStartContainer = res.indexOf("C");
			newResStringContainer = res.slice(nStartContainer-3, nStartContainer + 16);
			newResStringContainer[2] = i;

			var nStartSP1 = res.indexOf("S1");
			newResStringnSP1 = res.slice(nStartSP1-3, nStartSP1+4);
			newResStringnSP1[2] = i;
			//console.log(newResStringnSP1);

			var nStartSP2 = res.indexOf("S2");
			newResStringnSP2 = res.slice(nStartSP2-3, nStartSP2+4);
			newResStringnSP2[2] = i;
			//console.log(newResStringnSP2);

			//console.log(newResStringContainer.length);
			//console.log(newResStringnSPs.length);
			var TEAMID,MISSIONTIME,PACKETCOUNT,PACKETTYPE,MODE,SP1RELEASED,SP2RELEASED,ALTITUDE,TEMP,VOLTAGE,GPSTIME,GPSLATITUDE,GPSLONGITUDE,GPSALTITUDE,GPSSATS,SOFTWARESTATE,SP1PACKETCOUNT,SP2PACKETCOUNT,CMDECHO;
			var TEAMIDsp1,MISSIONTIMEsp1, PACKETCOUNTsp1, PACKETTYPEsp1, SPALTITUDEsp1, SPTEMPsp1, SPROTATIONRATEsp1;
			var  TEAMIDsp2,MISSIONTIMEsp2, PACKETCOUNTsp2, PACKETTYPEsp2, SPALTITUDEsp2, SPTEMPsp2, SPROTATIONRATEsp2;
	
			if(newResStringContainer[3] == "C" && newResStringContainer.length == 19){
				console.log("Paquete de Container se encontró y llegó bien: ");
				console.log(newResStringContainer);
				socket.emit("containerTelemetry", newResStringContainer);

			  	  TEAMID = newResStringContainer[0];
		          MISSIONTIME = newResStringContainer[1];
		          PACKETCOUNT = newResStringContainer[2];		         
		          PACKETTYPE = newResStringContainer[3];
		          MODE = newResStringContainer[4];
		          SP1RELEASED = newResStringContainer[5];
		          SP2RELEASED = newResStringContainer[6];
		          ALTITUDE = newResStringContainer[7];
		          TEMP = newResStringContainer[8];
		          VOLTAGE = newResStringContainer[9];
		          GPSTIME = newResStringContainer[10];
		          GPSLATITUDE = newResStringContainer[11];
		          GPSLONGITUDE = newResStringContainer[12];
		          GPSALTITUDE = newResStringContainer[13];
		          GPSSATS = newResStringContainer[14];
		          SOFTWARESTATE = newResStringContainer[15];
		          SP1PACKETCOUNT = newResStringContainer[16];
		          SP2PACKETCOUNT = newResStringContainer[17];
		          CMDECHO = newResStringContainer[18];
			  	  //console.log(TEAMID);
			      // console.log(MISSIONTIME);
			      // console.log(PACKETCOUNT);
			      // console.log(PACKETTYPE);
			      // console.log(MODE);
			      // console.log(SP1RELEASED);
			      // console.log(SP2RELEASED);
			      // console.log(ALTITUDE);
			      // console.log(TEMP);
			      // console.log(VOLTAGE);
			      // console.log(GPSTIME);
			      // console.log(GPSLATITUDE);
			      // console.log(GPSLONGITUDE);
			      // console.log(GPSALTITUDE);
			      // console.log(GPSSATS);
			      // console.log(SOFTWARESTATE);
			      // console.log(SP1PACKETCOUNT);
			      // console.log(SP2PACKETCOUNT);
			      // console.log(CMDECHO);
			      var fields = ['TEAM_ID','MISSION_TIME','PACKETCOUNT','PACKETTYPE','MODE','SP1RELEASED','SP2RELEASED','ALTITUDE','TEMP','VOLTAGE','GPSTIME','GPSLATITUDE','GPSLONGITUDE','GPSALTITUDE','GPSSATS','SOFTWARESTATE','SP1PACKETCOUNT','SP2PACKETCOUNT','CMDECHO'];
			      
				    var toCSV = [
				      	TEAMID,
				      	MISSIONTIME,
				      	PACKETCOUNT,
				      	PACKETTYPE,
				      	MODE,
				      	SP1RELEASED,
				      	SP2RELEASED,
				      	ALTITUDE,
				      	TEMP,
				      	VOLTAGE,
				      	GPSTIME,
				      	GPSLATITUDE,
				      	GPSLONGITUDE,
				      	GPSALTITUDE,
				      	GPSSATS,
				      	SOFTWARESTATE,
				      	SP1PACKETCOUNT,
				      	SP2PACKETCOUNT,
				      	CMDECHO

				      	];

				

					//Set String to send
					var containermqtt=TEAMID+','+MISSIONTIME+','+PACKETCOUNT+','+PACKETTYPE+','+MODE+','+SP1RELEASED+','+SP2RELEASED+','+ALTITUDE+','+TEMP+','+VOLTAGE+','+GPSTIME+','+GPSLATITUDE+','+GPSLONGITUDE+','+GPSALTITUDE+','+GPSSATS+','+SOFTWARESTATE+','+SP1PACKETCOUNT+','+SP2PACKETCOUNT+','+CMDECHO;
					console.log("Esto esta en containerMQTT \n " + containermqtt);
					//Publish
					clientMQTT.publish('teams/2092', containermqtt );
					//clientMQTT.unsubscribe('teams/2092')
					//clientMQTT.end();


					  


			      ///Guardar en csv
			      fs.stat('Flight_2092_C.csv', function (err, stat) {
					  if (err == null) {
					    //console.log('File exists, writing new data...');
					   // fs.truncate('team2092.csv', 0, function(){console.log('clear done... ');})
					    //write the actual data and end with newline
					    var csv = toCSV + newLine;

					    fs.appendFile('Flight_2092_C.csv', csv, function (err) {
					      if (err) throw err;
					      console.log('The data was appended to file!');
					    });
					  } else {
					    //write the headers and newline
					    //console.log('New file, just writing headers');
					    fields = fields + newLine;

					    fs.writeFile('Flight_2092_C.csv', fields, function (err) {
					      if (err) throw err;
					      console.log('File created and saved');
					    });
					  }
				});
			      
			   


			}
			
			if(newResStringnSP1[3] == "S1" && newResStringnSP1.length == 7){
				console.log("Paquete SP1 llegó correcto: ");
				console.log(newResStringnSP1);
				socket.emit("sp1Telemetry", newResStringnSP1);
				TEAMIDsp1 = newResStringnSP1[0];
			    MISSIONTIMEsp1 = newResStringnSP1[1];
			    PACKETCOUNTsp1 = newResStringnSP1[2];
			    PACKETTYPEsp1 = newResStringnSP1[3];
			    SPALTITUDEsp1 = newResStringnSP1[4];
			    SPTEMPsp1 = newResStringnSP1[5];
			    SPROTATIONRATEsp1 = newResStringnSP1[6];
				var fieldsSP1 = ['TEAM_ID','MISSION_TIME','PACKETCOUNT','PACKETTYPE','SP_ALTITUDE','SP_TEMP','SP_ROTATION_RATE'];
		        var toCSVsp1 = [
			      	TEAMIDsp1,
			      	MISSIONTIMEsp1,
			      	PACKETCOUNTsp1,
			      	PACKETTYPEsp1,
			      	SPALTITUDEsp1,
			      	SPTEMPsp1,
			      	SPROTATIONRATEsp1
		      	];

				  var spmqtt=TEAMIDsp1+','+MISSIONTIMEsp1+','+PACKETCOUNTsp1+','+'SP1'+','+SPALTITUDEsp1+','+SPTEMPsp1+','+SPROTATIONRATEsp1+',,,,,,,,,,,,';
				  //Send to MQTT
				  clientMQTT.publish('teams/2092', spmqtt );

		      	fs.stat('Flight_2092_S1.csv', function (err, stat) {
				  if (err == null) {
				    //console.log('File exists, writing new data...');
				   // fs.truncate('team2092.csv', 0, function(){console.log('clear done... ');})
				    //write the actual data and end with newline
				    var csvSP1 = toCSVsp1 + newLine;

				    fs.appendFile('Flight_2092_S1.csv', csvSP1, function (err) {
				      if (err) throw err;
				      console.log('The data was appended to file!');
				    });
				  } else {
				    //write the headers and newline
				    //console.log('New file, just writing headers');
				    fieldsSP1 = fieldsSP1 + newLine;

				    fs.writeFile('Flight_2092_S1.csv', fieldsSP1, function (err) {
				      if (err) throw err;
				      console.log('File created and saved');
				    });
				  }
				});

		
			}
			if(newResStringnSP2[3] == "S2" && newResStringnSP2.length == 7){

				console.log("Paquete SP2 llegó correcto: ");
				console.log(newResStringnSP2);
				socket.emit("sp2Telemetry", newResStringnSP2);
				TEAMIDsp2 = newResStringnSP2[0];
			    MISSIONTIMEsp2 = newResStringnSP2[1];
			    PACKETCOUNTsp2 = newResStringnSP2[2];
			    PACKETTYPEsp2 = newResStringnSP2[3];
			    SPALTITUDEsp2 = newResStringnSP2[4];
			    SPTEMPsp2 = newResStringnSP2[5];
			    SPROTATIONRATEsp2 = newResStringnSP2[6];
				var fieldsSP2 = ['TEAM_ID','MISSION_TIME','PACKETCOUNT','PACKETTYPE','SP_ALTITUDE','SP_TEMP','SP_ROTATION_RATE'];
		        var toCSVsp2 = [
			      	TEAMIDsp2,
			      	MISSIONTIMEsp2,
			      	PACKETCOUNTsp2,
			      	PACKETTYPEsp2,
			      	SPALTITUDEsp2,
			      	SPTEMPsp2,
			      	SPROTATIONRATEsp2
		      	];

				  //Send to MQTT
				  var spmqtt2=TEAMIDsp2+','+MISSIONTIMEsp2+','+PACKETCOUNTsp2+','+'SP2'+','+SPALTITUDEsp2+','+SPTEMPsp2+','+SPROTATIONRATEsp2+',,,,,,,,,,,,';
				  clientMQTT.publish('teams/2092', spmqtt2 );


		      	fs.stat('Flight_2092_S2.csv', function (err, stat) {
				  if (err == null) {
				    //console.log('File exists, writing new data...');
				   // fs.truncate('team2092.csv', 0, function(){console.log('clear done... ');})
				    //write the actual data and end with newline
				    var csvSP2 = toCSVsp2 + newLine;

				    fs.appendFile('Flight_2092_S2.csv', csvSP2, function (err) {
				      if (err) throw err;
				      console.log('The data was appended to file!');
				    });
				  } else {
				    //write the headers and newline
				    //console.log('New file, just writing headers');
				    fieldsSP2 = fieldsSP2 + newLine;

				    fs.writeFile('Flight_2092_S2.csv', fieldsSP2, function (err) {
				      if (err) throw err;
				      console.log('File created and saved');
				    });
				  }
				});
				

			}
			
		i++;
		k++;
		});//serialPort.on}

});	//sockets.io

});	



function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
//var contData = "2092,12:13:43,13,C,S,SP1_ON,SP2_ON,20,20,50,12:13:43,93.323243,75.234323,450,5,OK,45,50,CMDECHO";
//var sp1 = "2097,12:13:43,13,S1,20,25,345";
//var sp2 = "2097,12:13:43,13,S2,30,25,340";








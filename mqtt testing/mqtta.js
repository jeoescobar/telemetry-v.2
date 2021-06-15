var mqtt = require('mqtt')


var TEAMID='2092'
var MISSIONTIME='10:20:02'
var PACKETCOUNT='1'
var PACKETTYPE='SP1'
var MODE='F'
var SP1RELEASED='N'
var SP2RELEASED='N'
var ALTITUDE='233'
var TEMP='20'
var VOLTAGE='12'
var GPSTIME='23:52:01'
var GPSLATITUDE='23'
var GPSLONGITUDE='90'
var GPSALTITUDE='132'
var GPSSATS='2'
var SOFTWARESTATE='RELEASE_1'
var SP1PACKETCOUNT='0'
var SP2PACKETCOUNT='0'
var CMDECHO='CX_ON'
var SPALTITUDE='40'
var SPTEMP='17'
var SPROTATIONRATE='3'

var containermqtt=TEAMID+','+MISSIONTIME+','+PACKETCOUNT+','+PACKETTYPE+','+MODE+','+SP1RELEASED+','+SP2RELEASED+','+ALTITUDE+','+TEMP+','+VOLTAGE+','+GPSTIME+','+GPSLATITUDE+','+GPSLONGITUDE+','+GPSALTITUDE+','+GPSSATS+','+SOFTWARESTATE+','+SP1PACKETCOUNT+','+SP2PACKETCOUNT+','+CMDECHO;
var spmqtt=TEAMID+','+MISSIONTIME+','+PACKETCOUNT+','+PACKETTYPE+','+SPALTITUDE+','+SPTEMP+','+SPROTATIONRATE+',,,,,,,,,,,,';

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





const passwordC='Wiasfosa232!'
const usernameC='2092'
var i = 5;
var client  = mqtt.connect('mqtt://cansat.info:1883', {
                              username: usernameC, 
                              password: passwordC
              });

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
});


client.on('connect', function () {
    console.log('Connected');
    client.subscribe('teams/2092');
    var timer_id=   setInterval(function() {
        i++;
        PACKETCOUNT=i.toString();
        var containermqtt=TEAMID+','+MISSIONTIME+','+PACKETCOUNT+','+PACKETTYPE+','+MODE+','+SP1RELEASED+','+SP2RELEASED+','+ALTITUDE+','+TEMP+','+VOLTAGE+','+GPSTIME+','+GPSLATITUDE+','+GPSLONGITUDE+','+GPSALTITUDE+','+GPSSATS+','+SOFTWARESTATE+','+SP1PACKETCOUNT+','+SP2PACKETCOUNT+','+CMDECHO;
        var spmqtt=TEAMID+','+MISSIONTIME+','+PACKETCOUNT+','+PACKETTYPE+','+PACKETCOUNT+','+SPTEMP+','+SPROTATIONRATE+',,,,,,,,,,,,';
		client.publish('teams/2092', spmqtt );

        if (i==15) {//ens script
            clearTimeout(timer_id); //stop timer
            client.unsubscribe('teams/2092')
            client.end();	

        }

    }, 1000);


    

  });



   // PACKETCOUNT=n;
   // var containermqtt=TEAMID+','+MISSIONTIME+','+PACKETCOUNT+','+PACKETTYPE+','+MODE+','+SP1RELEASED+','+SP2RELEASED+','+ALTITUDE+','+TEMP+','+VOLTAGE+','+GPSTIME+','+GPSLATITUDE+','+GPSLONGITUDE+','+GPSALTITUDE+','+GPSSATS+','+SOFTWARESTATE+','+SP1PACKETCOUNT+','+SP2PACKETCOUNT+','+CMDECHO;
    
   
    //client.publish('teams/2092', JSON.stringify(toCSV));
    //client.publish('teams/2092', containermqtt);
    /*client.publish('teams/2092', containermqtt);
    client.publish('teams/2092', spmqtt);
    client.publish('teams/2092', containermqtt);
    client.publish('teams/2092', spmqtt);*/
   // n++;
    
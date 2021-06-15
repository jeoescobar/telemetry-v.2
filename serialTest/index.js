	//var fs = require('fs');
	//var csv = require('fast-csv');
	//var ws = fs.createWriteStream('my.csv',{flag: 'a'});
	//var json2csv = require('json2csv').parse;
	var newLine = '\r\n';
	var enviaString;

	var socket = io.connect('http://localhost:8080',{'forceNew': true});
	let containerCounter = 0;
	let sp1Counter = 0;
	let sp2Counter = 0;
	
	var TEAMID,MISSIONTIME,PACKETCOUNT,PACKETTYPE,MODE,SP1RELEASED,SP2RELEASED,ALTITUDE,TEMP,VOLTAGE,GPSTIME,GPSLATITUDE,GPSLONGITUDE,GPSALTITUDE,GPSSATS,SOFTWARESTATE,SP1PACKETCOUNT,SP2PACKETCOUNT,CMDECHO;
	var TEAMIDsp1,MISSIONTIMEsp1, PACKETCOUNTsp1, PACKETTYPEsp1, SPALTITUDEsp1, SPTEMPsp1, SPROTATIONRATEsp1;
	var  TEAMIDsp2,MISSIONTIMEsp2, PACKETCOUNTsp2, PACKETTYPEsp2, SPALTITUDEsp2, SPTEMPsp2, SPROTATIONRATEsp2;
	// TEAMID=2092;
	// MISSIONTIME=120243;
	// PACKETCOUNT=1;
	var geojson2;
	var geojson1;

	var GPSLATITUDEgcs; 
	var GPSLONGITUDEgcs;
	var GPSALTITUDEgcs;
	var marker1;
	var marker2;
	GPSLATITUDEgcs = 19.43113;
	GPSLONGITUDEgcs = -99.18154;
	GPSALTITUDEgcs = 10;

	GPSLATITUDE = 19.43883;
	GPSLONGITUDE = -99.18054;
	GPSALTITUDE = 10;
	// document.getElementById("GPSLATITUDE").innerHTML = GPSLATITUDE ;
	// document.getElementById("GPSLONGITUDE").innerHTML = GPSLONGITUDE ;
	//  document.getElementById("GPSALTITUDE").innerHTML = GPSALTITUDE ;
	// document.getElementById("MISSIONTIME").innerHTML = MISSIONTIME ;
	//  document.getElementById("PACKETCOUNT").innerHTML = PACKETCOUNT ;
	 mapboxgl.accessToken = 'pk.eyJ1Ijoicm9kb3ZlcmEiLCJhIjoiY2twcThvODFuMDJzYzJ4bzFub3ZhaDkyYyJ9.9IAS-nrlCoFzfGs61HuMTQ';
	 var map = new mapboxgl.Map({
	      container: 'map', // Specify the container ID
	      style: 'mapbox://styles/mapbox/navigation-day-v1', // Specify which map style to use
	      center: [GPSLONGITUDE, GPSLATITUDE ], // Specify the starting position [lng, lat]
	      pitch: 70, // pitch in degrees
		  bearing: -60, // bearing in degrees
	      zoom: 14// Specify the starting zoom
    });

	function startCommand(){
			console.log("start mission was pressed...");
			socket.emit("startMissionSocket", "start");
	} 
	function endCommand(){
			console.log("end mission was pressed...");
			socket.emit("endMissionSocket", "end");
	} 
	function importCommand(){
			console.log("import .csv was pressed...");
			//get csv path
			
			socket.emit("importMissionSocket", "import");
			
	} 
	function enableCommand(){
			console.log("enable was pressed...");
			socket.emit("enableMissionSocket", "enable");
	} 
	function activateCommand(){
			console.log("activate was pressed...");
			socket.emit("activateMissionSocket", "activate");
	} 


	socket.on("containerTelemetry", function(data){
		
		//console.log(data);
		//var coseno = Math.cos(data);
		//document.getElementById("container").innerHTML = data + "<br/>";
		TEAMID = data[0];
		document.getElementById("TEAMID").innerHTML = TEAMID ;
	    MISSIONTIME = data[1];
	    document.getElementById("MISSIONTIME").innerHTML = MISSIONTIME ;
	    PACKETCOUNT = data[2];	     
	    document.getElementById("PACKETCOUNT").innerHTML = PACKETCOUNT ;
	    PACKETTYPE = data[3];
	    document.getElementById("PACKETTYPE").innerHTML = PACKETTYPE ;
	    MODE = data[4];
	    document.getElementById("MODE").innerHTML = MODE ;
	    SP1RELEASED = data[5];
	    document.getElementById("SP1RELEASED").innerHTML = SP1RELEASED ;
	    SP2RELEASED = data[6];
	    document.getElementById("SP2RELEASED").innerHTML = SP2RELEASED ;
	    ALTITUDE = data[7];
	    //document.getElementById("ALTITUDE").innerHTML = ALTITUDE ;
	    TEMP = data[8];
	    //document.getElementById("TEMP").innerHTML = TEMP ;
	    VOLTAGE = data[9];
	    //document.getElementById("VOLTAGE").innerHTML = VOLTAGE ;
	    GPSTIME = data[10];
	    document.getElementById("GPSTIME").innerHTML = GPSTIME ;
	    GPSLATITUDE = data[11];
	    
	    //GPSLATITUDE = GPSLATITUDE + 0.001;
	    //console.log(GPSLATITUDE);
	    //document.getElementById("GPSLATITUDE").innerHTML = GPSLATITUDE ;
	    GPSLONGITUDE = data[12];
	    //document.getElementById("GPSLONGITUDE").innerHTML = GPSLONGITUDE ;
	    GPSALTITUDE = data[13];
	    //document.getElementById("GPSALTITUDE").innerHTML = GPSALTITUDE ;
	    GPSSATS = data[14];
	    document.getElementById("GPSSATS").innerHTML = GPSSATS ;
	    SOFTWARESTATE = data[15];
	    document.getElementById("SOFTWARESTATE").innerHTML = SOFTWARESTATE ;
	    SP1PACKETCOUNT = data[16];
	    document.getElementById("SP1PACKETCOUNT").innerHTML = SP1PACKETCOUNT ;
	    SP2PACKETCOUNT = data[17];
	    document.getElementById("SP2PACKETCOUNT").innerHTML = SP2PACKETCOUNT ;
	    CMDECHO = data[18];
	    document.getElementById("CMDECHO").innerHTML = CMDECHO ;
	    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		function getLocation() {
			if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(function showPosition(position){

			    	GPSLATITUDEgcs = position.coords.latitude;
			 		GPSLONGITUDEgcs = position.coords.longitude;
	 		 //console.log(GPSLATITUDEgcs);
			 //console.log(GPSLONGITUDEgcs);

				    

				    var geojson1 = {
						'type': 'FeatureCollection',
						'features': [
							{
								'type': 'Feature',
								'geometry': {
								'type': 'Point',
								'coordinates': [GPSLONGITUDE, GPSLATITUDE ]///LAS COORDENADAS LOCALES DEL CANSAT
								},
							'properties': {
							'title': 'Cansat',
							'description': 'Cansat'
							}
						}
					
						]
					};
					var geojson2 = {
						'type': 'FeatureCollection',
						'features': [
							{
								'type': 'Feature',
								'geometry': {
								'type': 'Point',
								'coordinates': [GPSLONGITUDEgcs, GPSLATITUDEgcs] ///LAS COORDENADAS LOCALES DE LA GCS
								},
							'properties': {
							'title': 'Cansat',
							'description': 'GCS'
							}
						}
					
						]
					};

				    var lng= GPSLONGITUDE;
					var lat= GPSLATITUDE;
					var ele = GPSALTITUDE;
			
					// add markers to map
					

					var el = document.createElement('div');
	  				el.className = 'marker1';
	  				var el2 = document.createElement('div');
	  				el2.className = 'marker2';

					var marker1 = new mapboxgl.Marker(el);
					var marker2 = new mapboxgl.Marker(el2);

					function animateMarker(timestamp) {
						
					 	
						// create a HTML element for each feature
						
						 
						marker1.setLngLat([
							GPSLONGITUDE,
							GPSLATITUDE
						]);
						marker1.addTo(map);

						marker2.setLngLat([
							GPSLONGITUDEgcs,
							GPSLATITUDEgcs
						]);
						marker2.addTo(map);
											
					 
					// Request the next frame of the animation.
						requestAnimationFrame(animateMarker);
					}
					 
					// Start the animation.
					requestAnimationFrame(animateMarker);
					document.getElementById("lng").innerHTML = lng ;
					document.getElementById("lat").innerHTML = lat ;
					document.getElementById("ele").innerHTML = ele ;
					

				    });
					    
			} else { 
				    
			}
		}

		var coords = getLocation();

		var lat1=GPSLATITUDE;
		var lon1=GPSLONGITUDE; 
		var lat2=GPSLONGITUDEgcs;
		var lon2 =GPSLATITUDEgcs;
		var altura = GPSALTITUDE;

		var Distancia = distance(lat1, lon1, lat2, lon2);   //Retorna numero en Km
		//console.log("Distancia 3d: " + Distancia.distanciaEleva + "m");
		//console.log("Ángulo Azimut: "+ Distancia.anguloAzimutGradosCalib + "°");
		//console.log("Ángulo Elevación: " + Distancia.anguloAzimutGradosCalib + "°");
		document.getElementById("distancia3d").innerHTML = Distancia.distanciaEleva ;
		document.getElementById("anguloElevaGrados").innerHTML = Distancia.anguloElevaGrados ;
		document.getElementById("anguloAzimutGradosCalib").innerHTML = Distancia.anguloAzimutGradosCalib ;
		function distance(lat1, lon1, lat2, lon2, unit) {
			if ((lat1 == lat2) && (lon1 == lon2)) {
				return 0;
			}
			else {
				var radlat1 = Math.PI * lat1/180;
				var radlat2 = Math.PI * lat2/180;
				var radlon1 = Math.PI * lon1/180;
				var theta = lon1-lon2;
				var phi = lat1-lat2;
				var radphi = Math.PI * phi/180;
				var radtheta = Math.PI * theta/180;
				var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
				if (dist > 1) {
					dist = 1;
				}
				dist = Math.acos(dist);
				dist = dist * 180/Math.PI;
				dist = dist * 60 * 1.1515*1.609344 * 1000;
				//if (unit=="K") { dist = dist * 1.609344 }
				//if (unit=="N") { dist = dist * 0.8684 }

				//Como conocemos la altura del objetivo, y ahora la distancia dist, con una simple ley de pitágoras, calculamos la hipotenusa:
				var distanciaEleva = Math.sqrt(Math.pow(altura,2) + Math.pow(dist,2) );
				//console.log("distanciaEleva= " + distanciaEleva + " [m]");

				//ángulo de elevación
				var anguloEleva = Math.atan(altura/dist);
				anguloElevaGrados = (anguloEleva*180/Math.PI);
				//console.log("anguloElevaciónGrados= " + anguloElevaGrados + " [°]");

				//ángulo de azimut:
				//console.log("tan=" + Math.tan(26.38*Math.PI/180))
				//console.log("sin=" + Math.sin(39.08*Math.PI/180))
				//var anguloAzimut = Math.atan( Math.tan(radtheta) / Math.sin(radlat1) );
				var b = Math.sin(radtheta) * Math.cos(	radlat2);
				var a = (Math.cos(radlat1)*Math.sin(radlat2)) - (Math.sin(radlat1)*Math.cos(radlat2)*Math.cos(radtheta));
				anguloAzimut = Math.atan2(b, a);
				var anguloAzimutGrados = -(anguloAzimut*180/Math.PI)  ;
				
				//console.log("anguloAzimutGrados= " + anguloAzimutGrados + " [°]");
				if(anguloAzimutGrados < 0) {
					anguloAzimutGradosCalib = anguloAzimutGrados + 360 + 40 ; // de ajuste - 15
				}else {
					anguloAzimutGradosCalib = anguloAzimutGrados + 40 ;	
				}
				//console.log("anguloAzimutGradosCalib= " + anguloAzimutGradosCalib  + " [°]");
				
				//anguloAzimutGrados = anguloAzimutGradosCalib - 40;

				AzimutRad = Math.PI*anguloAzimutGrados/180;
				//Para calcular X,Y, usemos azimut (real), y la dist
				x = dist*Math.sin(AzimutRad)
				y = dist*Math.cos(AzimutRad)
				//console.log("X= " + x + ", Y= " + y);



				return {distanciaEleva,anguloElevaGrados,anguloAzimutGradosCalib};
			}
		}



	    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		altitudeContainerChart.data.labels.push(MISSIONTIME);
		altitudeContainerChart.data.datasets.forEach(dataset => {

			dataset.data.push(ALTITUDE);
		});
		
		// //var datos =  data.toString('utf8');
		altitudeContainerChart.update();
		


		temperatureContainerChart.data.labels.push(MISSIONTIME);
		temperatureContainerChart.data.datasets.forEach(dataset => {

			dataset.data.push(TEMP);
		});	
		temperatureContainerChart.update();
		

		voltageContainerChart.data.labels.push(MISSIONTIME);
		voltageContainerChart.data.datasets.forEach(dataset => {

			dataset.data.push(VOLTAGE);
		});	
		voltageContainerChart.update();


		containerCounter++;

	});

	socket.on('sp1Telemetry', function(data){
		//document.getElementById("sp1").innerHTML = data + "<br/>";
	    TEAMIDsp1 = data[0];
	    document.getElementById("TEAMIDsp1").innerHTML = TEAMIDsp1 ;
        MISSIONTIMEsp1 = data[1];
        document.getElementById("MISSIONTIMEsp1").innerHTML = MISSIONTIMEsp1 ;
        PACKETCOUNTsp1 = data[2];
        document.getElementById("PACKETCOUNTsp1").innerHTML = PACKETCOUNTsp1 ;
        PACKETTYPEsp1 = data[3];
        document.getElementById("PACKETTYPEsp1").innerHTML = PACKETTYPEsp1 ;
        SPALTITUDEsp1 = data[4];
        SPTEMPsp1 = data[5];
        SPROTATIONRATEsp1 = data[6];
        //    console.log(TEAMID);
        // console.log(MISSIONTIME);
        // console.log(PACKETCOUNT);
        // console.log(PACKETTYPE);
        // console.log(SPALTITUDE);
        // console.log(SPTEMP);
        // console.log(SPROTATIONRATE);

     

		altitudeSp1Chart.data.labels.push(MISSIONTIMEsp1);
		altitudeSp1Chart.data.datasets.forEach(dataset => {

			dataset.data.push(SPALTITUDEsp1);
		});
		
		// //var datos =  data.toString('utf8');
		altitudeSp1Chart.update();


		temperatureSp1Chart.data.labels.push(MISSIONTIMEsp1);
		temperatureSp1Chart.data.datasets.forEach(dataset => {

			dataset.data.push(SPTEMPsp1);
		});	
		temperatureSp1Chart.update();

		rotationSP1Chart.data.labels.push(MISSIONTIMEsp1);
		rotationSP1Chart.data.datasets.forEach(dataset => {

			dataset.data.push(SPROTATIONRATEsp1);
		});	
		rotationSP1Chart.update();


		sp1Counter++;

	});
	socket.on('sp2Telemetry', function(data){
		//document.getElementById("sp2").innerHTML = data + "<br/>";
		TEAMIDsp2 = data[0];
		document.getElementById("TEAMIDsp2").innerHTML = TEAMIDsp2 ;
	    MISSIONTIMEsp2 = data[1];
	    document.getElementById("MISSIONTIMEsp2").innerHTML = MISSIONTIMEsp2 ;
	    PACKETCOUNTsp2 = data[2];
	    document.getElementById("PACKETCOUNTsp2").innerHTML = PACKETCOUNTsp2 ;
	    PACKETTYPEsp2 = data[3];
	    document.getElementById("PACKETTYPEsp2").innerHTML = PACKETTYPEsp2 ;
	    SPALTITUDEsp2 = data[4];
	    SPTEMPsp2 = data[5];
	    SPROTATIONRATEsp2 = data[6];
	   //    console.log(TEAMID);
	      // console.log(MISSIONTIME);
	      // console.log(PACKETCOUNT);
	      // console.log(PACKETTYPE);
	      // console.log(SPALTITUDE);
	      // console.log(SPTEMP);
	      // console.log(SPROTATIONRATE);


	    

		altitudeSp2Chart.data.labels.push(MISSIONTIMEsp2);
		altitudeSp2Chart.data.datasets.forEach(dataset => {

			dataset.data.push(SPALTITUDEsp2);
		});	
		altitudeSp2Chart.update();

		temperatureSp2Chart.data.labels.push(MISSIONTIMEsp2);
		temperatureSp2Chart.data.datasets.forEach(dataset => {

			dataset.data.push(SPTEMPsp2);
		});	
		temperatureSp2Chart.update();

		rotationSP2Chart.data.labels.push(MISSIONTIMEsp2);
		rotationSP2Chart.data.datasets.forEach(dataset => {

			dataset.data.push(SPROTATIONRATEsp2);
		});	
		rotationSP2Chart.update();




		sp2Counter++;
	
	});


	/////////////////////////////////////////////////////////ALTITUDE//////////////////////////////////////////////////
	var containerAltitudectx = document.getElementById('containerAltitudeChart').getContext('2d');
	var altitudeContainerChart = new Chart(containerAltitudectx, {
	    type: 'line',
	    data: {
	        labels: [],	
	        datasets: [{
				data: [],
	        	label: "Container Altitude [m]",
	        	backgroundColor: "#55bae7",
	        	borderColor: "#55bae7",
	        	
			    pointBorderColor: "#000000",

			    pointHoverBackgroundColor: "#55bae7",
			    pointHoverBorderColor: "#55bae7",
			    scaleStepWidth: 1,
	        	
	        }]
	    },
	    options: {
	    	
	    	responsive: false,
	    	
            

		   	        
	    }
	});

	var sp1Altitudectx = document.getElementById('sp1PAltitudeChart').getContext('2d');
	var altitudeSp1Chart = new Chart(sp1Altitudectx, {
	    type: 'line',
	    data: {
	        labels: [],	
	        datasets: [{
	        	label: "SP1 Altitude [m]",
	        	backgroundColor: "#DC143C",
	        	borderColor: "#DC143C",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#DC143C",
			    pointHoverBorderColor: "#DC143C",
	        	data: [],
	        }]
	    },
	    options: {
	    	responsive: false
	        
	    }
	});
	var sp2Altitudectx = document.getElementById('sp2PAltitudeChart').getContext('2d');
	var altitudeSp2Chart = new Chart(sp2Altitudectx, {
	    type: 'line',
	    data: {
	        labels: [],	
	        datasets: [{
	        	label: "SP2 Altitude [m]",
	        	backgroundColor: "#008B8B",
	        	borderColor: "#008B8B",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#008B8B",
			    pointHoverBorderColor: "#008B8B",
	        	data: [],
	        }]
	    },
	    options: {
	    	responsive: false
	        
	    }
	});
	/////////////////////////////////////////////////////////TEMPERATURE//////////////////////////////////////////////////
	var containerTemperaturectx = document.getElementById('containerTemperatureChart').getContext('2d');
	var temperatureContainerChart = new Chart(containerTemperaturectx, {
	    type: 'line',
	    data: {
	        labels: [],	
	        datasets: [{
				data: [],
	        	label: "Container Temp [°C]",
	        	backgroundColor: "#55bae7",

	        	borderColor: "#55bae7",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#55bae7",
			    pointHoverBorderColor: "#55bae7",
	        	
	        }]
	    },
	    options: {
	    	
	    	responsive: false,
		    
					        
	    }
	});

	var sp1Temperaturectx = document.getElementById('sp1TemperatureChart').getContext('2d');
	var temperatureSp1Chart = new Chart(sp1Temperaturectx, {
	    type: 'line',
	    data: {
	        labels: [],	
	        datasets: [{
	        	label: "SP1 Temp [°C]",
	        	backgroundColor: "#DC143C",
	        	borderColor: "#DC143C",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#DC143C",
			    pointHoverBorderColor: "#DC143C",
	        	data: [],
	        }]
	    },
	    options: {
	    	responsive: false,
	        
	    }
	});
	var sp2Temperaturectx = document.getElementById('sp2TemperatureChart').getContext('2d');
	var temperatureSp2Chart = new Chart(sp2Temperaturectx, {
	    type: 'line',
	    data: {
	        labels: [],	
	        datasets: [{
	        	label: "SP2 Temp [°C]",
	        	backgroundColor: "#008B8B",
	        	borderColor: "#008B8B",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#008B8B",
			    pointHoverBorderColor: "#008B8B",
	        	data: [],
	        }]
	    },
	    options: {
	    	responsive: false
	        
	    }
	});
/////////////////////////////////////////////////////////CONTAINER VOLTAGE//////////////////////////////////////////////////
var containerVoltagectx = document.getElementById('containerVoltageChart').getContext('2d');
	var voltageContainerChart = new Chart(containerVoltagectx, {
	    type: 'bar',
	    data: {
	    	labels: [],
	        //labels: [],	
	        datasets: [{
				data: [],
				//data: [],
	        	label: "Container Voltage [V]",
	        	backgroundColor: "#55bae7",
	        	borderColor: "#55bae7",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#55bae7",
			    pointHoverBorderColor: "#55bae7",
	        	hoverOffset: 4
	        }]
	    },
	    options: {
	    	
	    	responsive: false,
		   	        
	    }
	});
/////////////////////////////////////////////////////////SP1 ROTATION RATE//////////////////////////////////////////////////
var sp1Rotationctx= document.getElementById('sp1RotationChart').getContext('2d');
	var rotationSP1Chart = new Chart(sp1Rotationctx, {
	    type: 'line',
	    data: {
	        labels: [],
	        datasets: [{
				data: [],
	        	label: "SP1 Rotation Rate [rpm]",
	        	backgroundColor: "#DC143C",
	        	borderColor: "#DC143C",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#DC143C",
			    pointHoverBorderColor: "#DC143C",
	        	hoverOffset: 4
	        }]
	    },
	    options: {
	    	
	    	responsive: false,
		   	        
	    }
	});	
/////////////////////////////////////////////////////////SP2 ROTATION RATE//////////////////////////////////////////////////
var sp2Rotationctx = document.getElementById('sp2RotationChart').getContext('2d');
	var rotationSP2Chart = new Chart(sp2Rotationctx, {
	    type: 'line',
	    data: {
	        labels: [],
	        datasets: [{
				data: [],
	        	label: "SP2 Rotation Rate [rpm]",
	        	backgroundColor: "#008B8B",
	        	borderColor: "#008B8B",
	        	
			    pointBorderColor: "#000000",
			    pointHoverBackgroundColor: "#008B8B",
			    pointHoverBorderColor: "#008B8B",
	        	 hoverOffset: 4
	        }]
	    },
	    options: {
	    	
	    	responsive: false,
		   	        
	    }
	});	

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	





	
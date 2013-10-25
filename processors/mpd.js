
var mpd = require('mpd'),
    cmd = mpd.cmd

// ### Local variable definition

var client;
var connectTimeout;
var statusChecker;

var m_db;
var m_name;

var state = {};
var song = {};

// ### run
// Params : name, poolInterval, params, db
// Start backend

exports.run = function(name, poolInterval, params, db){

	m_db = db;
	m_name = name
    
    connect(params.host, params.port);
}

exports.write = function(params, deviceType, device, actuator, value){

	switch(actuator){

		case "play":

			play();
			break;

		case "stop":
		
			stop();
			break;

		case "volume":
		
			volume(value);
			break;

		case "previous":

			previous();
			break;

		case "next":
		
			next();
			break;
	}
}



/* Write to database                                      */
/* ****************************************************** */

function saveState(state, song){

	var state = {

	    processor : "mpd",
	    pooler : m_name,
	    type : "Mpdcontroler",
	    deviceId : "0",
	    values : [state, song],
	    actuators : ["play", "stop", "previous", "next", "volume"]
	}

	m_db.save(m_name + "-" + "Mpdcontroler-0", state);
}



/* MPD FUNCTIONS                                          */
/* ****************************************************** */


/* Connection */

function connect(host, port){

	client = mpd.connect({

	    port: port,
	    host: host,
	});	

	client.on('ready', function() {

		console.log("Connected to MPD");

			getStatus(function(message){

				state = message;

				//console.log(message);
				saveState(state, song);
			});

		    getCurrentSong(function(message){

		    	song = message;

		    	//console.log(message);
		    	saveState(state, song);
		    });

		/* We are connected, we don't need to try to reconnect */

		if (connectTimeout !== undefined && connectTimeout !== null){

			clearInterval(connectTimeout);
		}

		/* Getting status every minutes to generate traffic and be sure we are connected if mpd go offline then online */

		statusChecker = setInterval (function(){

			getStatus();
		},10000);
	});

	client.on('error', function(){});

	client.on('system', function(name){

		
	});

	client.on('system-mixer', function(){

		getStatus(function(message){

			//console.log(message);
			state = message;
			saveState(state, song);
		});
	});

	client.on('system-playlist', function(){

		getCurrentPlaylist(function(message){

			console.log(message);
		});
	});

	client.on('system-player', function() {

		getStatus(function(message){

			//console.log(message);
			state = message;
			saveState(state, song);
		});

	    getCurrentSong(function(message){

	    	//console.log(message);
	    	song = message;
	    	saveState(state, song);
	    });
	});

	client.on('end', function() {

		console.log("Disconnected from mpd");

		if (statusChecker !== undefined && statusChecker !== null){

			clearInterval(statusChecker);
		}

		setTimeout(function(){connect();}, 5000);
	});
}

/* Player control */

function play(){

	client.sendCommand(cmd("play", []), function(err, msg) {
		if (err) throw err;
	});
}

function stop(){

	client.sendCommand(cmd("stop", []), function(err, msg) {
		if (err) throw err;
	});	
}

function previous(){

	client.sendCommand(cmd("previous", []), function(err, msg) {
		if (err) throw err;
	});	
}

function next(){

	client.sendCommand(cmd("next", []), function(err, msg) {
		if (err) throw err;
	});	
}

/*  Status */

function getStatus(callback){

	client.sendCommand(cmd("status", []), function(err, msg) {

	    if (err) throw err;

        if(callback !== undefined)
    		callback(parseLinesAsJsonObject(msg));
	});
}

function getCurrentSong(callback){

	client.sendCommand(cmd("currentsong", []), function(err, msg) {

	    if (err) throw err;

	    if(callback !== undefined)
			callback(parseLinesAsJsonObject(msg));
	});
}

/* Playlist */

function getCurrentPlaylist(callback){

	client.sendCommand(cmd("playlist", []), function(err, msg) {

	    if (err) throw err;

	    var result = []
	    var ar = parseLinesAsJsonArray(msg);
	    for (var i in ar){

	    	result[i.split(':')[0]] = ar[i];
	    }

	    if(callback !== undefined)
			callback(result);
	});	
}

function addToPlaylist(url){

	client.sendCommand(cmd("add", [url]), function(err, msg) {

	    if (err) throw err;
	});	
}

function clearPlaylist(){

	client.sendCommand(cmd("clear", []), function(err, msg) {

	    if (err) throw err;
	});	
}

/* Database */

function updateDatabase(){

	client.sendCommand(cmd("update", []), function(err, msg) {

	    if (err) throw err;
	});	
}

function listFolder(path, callback){

	client.sendCommand(cmd("lsinfo", [path]), function(err, msg){

		if (err) throw err;
		
		if(callback !== undefined)
			callback(msg);
	});
}

/*  Helper */

function parseLinesAsJsonObject(msg){

	var elems = {};
	var lines = msg.split('\n');
	for (var i in lines){

		if (lines[i].split(': ')[0] !== '')
			elems[lines[i].split(': ')[0]] = lines[i].split(': ')[1] ;
	}

	return elems;
}

function parseLinesAsJsonArray(msg){

	var elems = [];
	var lines = msg.split('\n');
	for (var i in lines){

		if (lines[i].split(': ')[0] !== '')
			elems[lines[i].split(': ')[0]] = lines[i].split(': ')[1] ;
	}

	return elems;
}

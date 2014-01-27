var config = require('../../lib/lib-config');
var log = require('../../lib/lib-log');
var instances = config.load( '/config/instances.json');
var cronJob = require('cron').CronJob;
var db = require('./lib-database.js');
var triggers = config.load( '/config/triggers.json');

exports.loadScene = function(name, callback){

	try{

		var scene = require("../../config/scenes/" + name + ".json");

		console.log(scene)

		for (var idx in scene.actions){

			var item = scene.actions[idx];

			if (item.delay === 0)
				exports.callDevice(item.name, item.backend, item.deviceType, item.device, item.actuator, item.value);
			else
				delayCall(item);
		}

		if (callback !== undefined && callback !== null){

			callback(true);
		}

		function delayCall(item){

			setTimeout(function(){
				
				exports.callDevice(item.name, item.backend, item.deviceType, item.device, item.actuator, item.value);
			}, item.delay * 1000)	
		}	
	}
	catch(err){

		log.write("loadScene", err);

		if (callback !== undefined && callback !== null){

			callback(err);
		}
	}	
}

exports.callDevice = function(name, backend, deviceType, device, actuator, value, callback){

	try{

	    var instanceParams = getParamsForDevice(backend, name);
	    var proc = require("../backends/" + backend + "/main.js");
	    proc.write(instanceParams, deviceType, device, actuator, value)

	    if (callback !== undefined && callback !== null){

	    	callback(true);
	    }
	}
	catch(err){

	    log.write("callDevice", err);

	    if (callback !== undefined && callback !== null){

	    	callback(err);
	    }
	}

	function getParamsForDevice(backend, name){

	    for (var idx in instances){

	        var value = instances[idx];
	        
	        if (value.name === name && value.backend === backend){

	            return value.params;
	        }
	    }

	    return undefined;
	}
}

exports.getPlaces = function (){

	var ar = [];
	var arRet = [];
	var cfg = config.load('/config/devicesAssociation.json');

	for (var i in cfg ){

		if (ar.indexOf(cfg[i].place) === -1){

			ar.push(cfg[i].place);
			arRet.push({name : cfg[i].place});
		}
	}

	return arRet;
}

exports.checkChangeTrigger = function(key, value){

	if (triggers[key] != undefined){

		var trig = triggers[key];

		var date = new Date();
		var time = date.getHours() + ":" + date.getMinutes();
		var day = date.getDay(); if (day === 0) day = 7; else day--;

		if(time >  trig.startTime && time < trig.endTime && trig.dayOfWeek.indexOf(day) !== -1){

			if ( evaluateConditions(trig.conditions) ){

				log.write("tools::checkChangeTrigger", "Execute scene " + trig.scene + " for trigger");
				exports.loadScene(trig.scene);
			}			
		}
	}
}

exports.createSceneJob = function(schedule){

	log.write("tools::createSceneJob", "Creating cronjob : " + schedule.cron + " loading scene : " + schedule.scene);

	try{

		var job  = new cronJob(schedule.cron, function(){

			log.write("[cronjob]", "Running scene : " + schedule.scene);

			if (evaluateConditions(schedule.conditions))
		    	exports.loadScene(schedule.scene);
		});	

		job.start();
	}
	catch(err){

		log.write("tools::createSceneJob", err);
	}    
} 

exports.writeVirtualDevice = function(deviceId, value){

	var obj = {
		
		backend : "virtual",
	    instance : deviceId,
	    type : "virtual",
	    deviceId : "0",
	    values : [{value : value}],
	    actuators : [],
	    group : "virtual"
	}

	db.save(deviceId + "-" + "virtual-0", obj);
}

function evaluateConditions(conditions){

	var ex = true;

	for (var idx in conditions){ // Foreach conditions specified

		try{

			var cond = conditions[idx]; // Current condition in array

			var item = db.get(cond[0]); // Item of the condition

			var itemValue = item.values[cond[1]][cond[2]]; // Value of this item 

			ex = eval(itemValue + cond[3] + cond[4]); // Evaluate the condition

			if (!ex) return false;
		}
		catch(err){}
	}

	return ex;
}

var config = require('../../lib/lib-config');
var log = require('../../lib/lib-log');
var modules = config.load( '/config/modules.json');
var cronJob = require('cron').CronJob;

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

	    for (var idx in modules){

	        var value = modules[idx];
	        
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

	// TODO : Implement trigger
}

exports.createSceneJob = function(cron, scene){

	log.write("tools::createSceneJob", "Creating cronjob : " + cron + " loading scene : " + scene);

	try{

		var job  = new cronJob(cron, function(){

			log.write("[cronjob]", "Running scene : " + scene);

		    exports.loadScene(scene);
		});	

		job.start();
	}
	catch(err){

		log.write("tools::createSceneJob", err);
	}    
} 
var config = require('../../lib/lib-config');
var log = require('../../lib/lib-log');
var modules = config.load( '/config/modules.json');

exports.loadScene = function(name, callback){

	try{

		var scene = require("../scenes/" + name + ".json");

		for (var idx in scene.actions){

			var item = scene.actions[idx];

			if (item.delay === 0)
				exports.callModule(item.name, item.processor, item.deviceType, item.device, item.actuator, item.value);
			else
				delayCall(item);
		}

		if (callback !== undefined && callback !== null){

			callback(true);
		}

		function delayCall(item){

			setTimeout(function(){
				
				exports.callModule(item.name, item.processor, item.deviceType, item.device, item.actuator, item.value);
			}, item.delay)	
		}	
	}
	catch(err){

		log.write("loadScene", err);

		if (callback !== undefined && callback !== null){

			callback(err);
		}
	}	
}

exports.callModule = function(name, processor, deviceType, device, actuator, value, callback){

	try{

	    var poolerParams = getParamsForModule(processor, name);
	    var proc = require("../processors/" + processor + ".js");
	    proc.write(poolerParams, deviceType, device, actuator, value)

	    if (callback !== undefined && callback !== null){

	    	callback(true);
	    }
	}
	catch(err){

	    log.write("callModule", err);

	    if (callback !== undefined && callback !== null){

	    	callback(err);
	    }
	}

	function getParamsForModule(processor, name){

	    for (var idx in modules){

	        var value = modules[idx];
	        
	        if (value.name === name && value.processor === processor){

	            return value.params;
	        }
	    }

	    return undefined;
	}
}

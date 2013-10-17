var config = require('../../lib/lib-config');
var modules = config.load( '/config/modules.json');

setTimeout(function(){exports.loadScene("AllOn")}, 5000)

exports.loadScene = function(name){

	var scene = require("../scenes/" + name + ".json");

	for (var idx in scene.actions){

		var item = scene.actions[idx];

		if (item.delay === 0)
			exports.callModule(item.name, item.processor, item.deviceType, item.device, item.actuator, item.value);
		else
			setTimeout(function(){
				exports.callModule(item.name, item.processor, item.deviceType, item.device, item.actuator, item.value);
			}, item.delay)
	}
}

exports.callModule = function(name, processor, deviceType, device, actuator, value){

	try{

	    var poolerParams = getParamsForModule(processor, name);
	    var proc = require("../processors/" + processor + ".js");
	    proc.write(poolerParams, deviceType, device, actuator, value)
	}
	catch(err){

	    console.log(err)
	}
}

function getParamsForModule(processor, name){

    for (var idx in modules){
        console.log(modules[idx])
        var value = modules[idx];
        
        if (value.name === name && value.processor === processor){

            return value.params;
        }
    }

    return undefined;
}
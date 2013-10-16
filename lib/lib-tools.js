var config = require('../../../lib/lib-config');
var modules = config.load( '/config/modules.json');


exports.loadScene = function(name){

}

exports.callModule = function(name, processor, deviceType, device, actuator, value){

	try{

	    var poolerParams = getParamsForModule(processor, name);
	    var proc = require("../../processors/" + processor + ".js");
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
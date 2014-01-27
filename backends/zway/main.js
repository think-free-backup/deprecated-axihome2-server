
var restify = require('restify');
var db = require('../../lib/lib-database.js');

// ### Object variable definition

var objs = function(){};

// ### run
// Params : name, poolInterval, params, db
// Start backend

exports.run = function(name, poolInterval, params){
    
    var timer;
    var parameters = {instanceName : name, poolInterval : poolInterval, params : params, timer : timer};

    pool(parameters);
}

// ### pool
// Params : none
// Pooling function

function pool(params){

    var client = restify.createJsonClient({
        url: 'http://' + params.params.host + ':' + params.params.port,
        version: '*',
        retry: {'retries': 0}
    });

    client.get(params.params.path + 'ZWaveAPI/Data/0', function(err, req, res, obj) {

        if (err){
            console.log(err);
            setTimeout(pool, params.poolInterval * 2, params);
            return;
        }

        for (var idx in obj.devices){

            var value = obj.devices[idx];
            var type = value.data["deviceTypeString"].value.split(' ').join('');

            try{

                var dev = objs[type].create(params, idx, value.instances);

                db.save(params.instanceName + "-" + type + "-" + dev.deviceId, dev);
            }
            catch(err){

                //console.log("Unknown device found in network : " + type);
            }
        }
        client.close();
        setTimeout(pool, params.poolInterval, params);
    });
}


// ### write
// Params : json
// Write to the backend the new value

exports.write = function(params, deviceType, device, actuator, value){

    try{

        objs[deviceType][actuator](params, device, value);    
    }
    catch (err){
        
        console.log("Error calling write for device '" + deviceType + "' actuator '" + actuator + "'");
        console.log(err)
    }
}

/* ** TYPE DEFINITION ******************************************************************************************* */

// ### BinaryPowerSwitch

objs.BinaryPowerSwitch = function () {};

    objs.BinaryPowerSwitch.create = function(params, device, instances){

        var stateValue = instances[0].commandClasses[37].data.level.value;

        var obj = {

            backend : "zway",
            instance : params.instanceName,
            type : "BinaryPowerSwitch",
            deviceId : device,
            values : [{state : stateValue}],
            actuators : ["setState"],
            group : "switch"
        }

        return obj;
    }

    objs.BinaryPowerSwitch.setState = function(params, device, value){

        var client = restify.createJsonClient({
            url: 'http://' + params.host + ':' + params.port,
            version: '*'
        });

        client.get('/ZWaveAPI/Run/devices[' + device + '].instances[0].commandClasses[37].Set(' + value + ')', function(err, req, res, obj) {

            if (err){
                console.log("Write error : " + err);
                return;
            }
        });
    }

// ### RoutingMultilevelSwitch

objs.RoutingMultilevelSwitch = function(){};

    objs.RoutingMultilevelSwitch.create = function(params, device, instances){

        var levelValue = instances[0].commandClasses[38].data.level.value;

        var obj = {

            backend : "zway",
            instance : params.instanceName,
            type : "RoutingMultilevelSwitch",
            deviceId : device,
            values : [{level : levelValue}],
            actuators : ["setLevel"],
            group : "switch"
        }

        return obj;
    }

    objs.RoutingMultilevelSwitch.setLevel = function(params, device, value){

        var client = restify.createJsonClient({
            url: 'http://' + params.host + ':' + params.port,
            version: '*'
        });

        client.get('/ZWaveAPI/Run/devices[' + device + '].instances[0].commandClasses[38].Set(' + value + ')', function(err, req, res, obj) {

            if (err){
                console.log("Write error : " + err);
                return;
            }
        });
    }

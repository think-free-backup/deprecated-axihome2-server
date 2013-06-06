
var restify = require('restify');

// ### Local variable definition

var m_poolName = "";
var m_poolInterval = -1;
var m_params = [];
var m_db;

var objs = function(){};

var timer; 


// ### run
// Params : name, poolInterval, params, db
// Start backend

exports.run = function(name, poolInterval, params, db){
    
    m_poolName = name;
    m_poolInterval = poolInterval;
    m_params = params;
    m_db = db;

    pool();
}

// ### pool
// Params : none
// Pooling function

function pool(){

    var client = restify.createJsonClient({
        url: 'http://' + m_params.ip + ':' + m_params.port,
        version: '*'
    });

    client.get(m_params.path + 'ZWaveAPI/Data/0', function(err, req, res, obj) {

        if (err){
            console.log(err);
            return;
        }

        for (var idx in obj.devices){

            var value = obj.devices[idx];
            var type = value.data["deviceTypeString"].value.split(' ').join('');

            try{

                var dev = objs[type].create(idx,value.instances);

                m_db.save(m_poolName + "-" + type + "-" + dev.deviceId, dev);
            }
            catch(err){

                //console.log("Unknown device found in network : " + type);
            }
        }

        setTimeout(pool, m_poolInterval);
    });
}


// ### write
// Params : json
// Write to the backend the new value

exports.write = function(deviceType, device, actuator, value){

    try{

        objs[deviceType][actuator](device, value);    
    }
    catch (err){
        
        console.log("Error calling write for device '" + deviceType + "' actuator '" + actuator + "'");
    }
    
}

/* ** TYPE DEFINITION ******************************************************************************************* */

// ### BinaryPowerSwitch

objs.BinaryPowerSwitch = function () {};

    objs.BinaryPowerSwitch.create = function(device, instances){

        var stateValue = instances[0].commandClasses[37].data.level.value;

        var obj = {

            pooler : m_poolName,
            type : "BinaryPowerSwitch",
            deviceId : device,
            values : [{state : stateValue}],
            actuators : ["setState"]
        }

        return obj;
    }

    objs.BinaryPowerSwitch.setState = function(device, value){

        var client = restify.createJsonClient({
            url: 'http://' + m_params.ip + ':' + m_params.port,
            version: '*'
        });

        client.get('/ZWaveAPI/Run/devices[' + device + '].instances[0].commandClasses[37].Set(' + value + ')', function(err, req, res, obj) {

            if (err){
                console.log(err);
                return;
            }
        });
    }

// ### RoutingMultilevelSwitch

objs.RoutingMultilevelSwitch = function(){};

    objs.RoutingMultilevelSwitch.create = function(device, instances){

        var levelValue = instances[0].commandClasses[38].data.level.value;

        var obj = {

            pooler : m_poolName,
            type : "RoutingMultilevelSwitch",
            deviceId : device,
            values : [{level : levelValue}],
            actuators : ["setLevel"] 
        }

        return obj;
    }

    objs.RoutingMultilevelSwitch.setLevel = function(device, value){

        var client = restify.createJsonClient({
            url: 'http://' + m_params.ip + ':' + m_params.port,
            version: '*'
        });

        client.get('/ZWaveAPI/Run/devices[' + device + '].instances[0].commandClasses[38].Set(' + value + ')', function(err, req, res, obj) {

            if (err){
                console.log(err);
                return;
            }
        });
    }

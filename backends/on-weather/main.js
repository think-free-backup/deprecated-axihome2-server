
var restify = require('restify');
var db = require('../../lib/lib-database.js');

// ### Local variable definition

var objs = function(){};

var windir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NWN"];

// ### run
// Params : name, poolInterval, params, db
// Start backend

exports.run = function(name, poolInterval, params){
    
    var timer;
    var olderTs = -1;
    var parameters = {instanceName : name, poolInterval : poolInterval, params : params, timer : timer, olderTs : olderTs};

    pool(parameters);
}

// ### pool
// Params : none
// Pooling function

function pool(params){

    var client = restify.createJsonClient({
        url: 'http://' + params.params.host + ':' + params.params.port,
        version: '*'
    });

    client.get( params.params.path + 'api/current/summary', function(err, req, res, obj) {

        if (err){
            console.log(err);
            setTimeout(pool, params.poolInterval * 2, params);
            return;
        }

        if (obj.body.date != params.olderTs){

            params.olderTs = obj.body.date;

            for (var key in obj.body){
                var value = obj.body[key];

                try{

                    objs[key].create(params, value);
                }
                catch(err){

                }
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
    }
}

/* ** TYPE DEFINITION ******************************************************************************************* */

// ### pressure

objs.pressure = function () {};

    objs.pressure.create = function(params, value){

        var obj = {

            instance : params.instanceName,
            type : "pressure",
            deviceId : "0",
            values : [{value : value}],
            actuators : [],
            group : "weather"
        }

        db.save(params.instanceName + "-" + "pressure-0", obj);
    }


// ### rain_day_total

objs.rain_day_total = function () {};

    objs.rain_day_total.create = function(params, value){

        var obj = {

            instance : params.instanceName,
            type : "rain_day",
            deviceId : "0",
            values : [{value : value}],
            actuators : [],
            group : "weather"
        }

        db.save(params.instanceName + "-" + "rain_day-0", obj);
    }

// ### wind_dir

objs.wind_dir = function () {};

    objs.wind_dir.create = function(params, value){

        var obj = {

            instance : params.instanceName,
            type : "wind_dir",
            deviceId : "0",
            values : [{value : windir[value]}],
            actuators : [],
            group : "weather"
        }

        db.save(params.instanceName + "-" + "wind_dir-0", obj);
    }

// ### wind_speed

objs.wind_speed = function () {};

    objs.wind_speed.create = function(params, value){

        var obj = {

            instance : params.instanceName,
            type : "wind_speed",
            deviceId : "0",
            values : [{value : value}],
            actuators : [],
            group : "weather"
        }

        db.save(params.instanceName + "-" + "wind_speed-0", obj);
    }

// ### temperature

objs.temperature = function () {};

    objs.temperature.create = function(params, value){

        for (var id in value){
            var mesure = value[id];
            
            var obj = {

                instance : params.instanceName,
                type : "temperature",
                deviceId : mesure.sensor,
                values : [{value : mesure.value}],
                actuators : [],
                group : "weather"
            }

            db.save(params.instanceName + "-" + "temperature-" + mesure.sensor, obj);
        }
    }

// ### humidity

objs.humidity = function () {};

    objs.humidity.create = function(params, value){

        for (var id in value){
            var mesure = value[id];
            
            var obj = {

                instance : params.instanceName,
                type : "humidity",
                deviceId : mesure.sensor,
                values : [{value : mesure.value}],
                actuators : [],
                group : "weather"
            }

            db.save(params.instanceName + "-" + "humidity-" + mesure.sensor, obj);
        }
    }

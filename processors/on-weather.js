
var restify = require('restify');

// ### Local variable definition

var m_poolName = "";
var m_poolInterval = -1;
var m_params = [];
var m_db;

var objs = function(){};

var timer; 

var olderTs = -1;


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

    client.get( m_params.path + 'api/current/summary', function(err, req, res, obj) {

        if (err){
            console.log(err);
            return;
        }

        if (obj.body.date != olderTs){

            olderTs = obj.body.date;

            for (var key in obj.body){
                var value = obj.body[key];

                try{

                    objs[key].create(value);
                }
                catch(err){

                }
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

// ### pressure

objs.pressure = function () {};

    objs.pressure.create = function(value){

        var obj = {

            pooler : m_poolName,
            type : "pressure",
            deviceId : "1",
            values : [{value : value}],
            actuators : []
        }

        m_db.save(m_poolName + "-" + "pressure", obj);
    }


// ### rain_day_total

objs.rain_day_total = function () {};

    objs.rain_day_total.create = function(value){

        var obj = {

            pooler : m_poolName,
            type : "rain_day",
            deviceId : "1",
            values : [{value : value}],
            actuators : []
        }

        m_db.save(m_poolName + "-" + "rain_day", obj);
    }

// ### wind_dir

objs.wind_dir = function () {};

    objs.wind_dir.create = function(value){

        var obj = {

            pooler : m_poolName,
            type : "wind_dir",
            deviceId : "1",
            values : [{value : value}],
            actuators : []
        }

        m_db.save(m_poolName + "-" + "wind_dir", obj);
    }

// ### wind_speed

objs.wind_speed = function () {};

    objs.wind_speed.create = function(value){

        var obj = {

            pooler : m_poolName,
            type : "wind_speed",
            deviceId : "1",
            values : [{value : value}],
            actuators : []
        }

        m_db.save(m_poolName + "-" + "wind_speed", obj);
    }

// ### temperature

objs.temperature = function () {};

    objs.temperature.create = function(value){

        for (var id in value){
            var mesure = value[id];
            
            var obj = {

                pooler : m_poolName,
                type : "temperature",
                deviceId : mesure.sensor,
                values : [{value : mesure.value}],
                actuators : []
            }

            m_db.save(m_poolName + "-" + "temperature-" + mesure.sensor, obj);
        }
    }

// ### humidity

objs.humidity = function () {};

    objs.humidity.create = function(value){

        for (var id in value){
            var mesure = value[id];
            
            var obj = {

                pooler : m_poolName,
                type : "humidity",
                deviceId : mesure.sensor,
                values : [{value : mesure.value}],
                actuators : []
            }

            m_db.save(m_poolName + "-" + "humidity-" + mesure.sensor, obj);
        }
    }

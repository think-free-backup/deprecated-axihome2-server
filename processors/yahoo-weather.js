
var restify = require('restify');

// ### Local variable definition

var m_poolName = "";
var m_poolInterval = -1;
var m_params = [];
var m_db;

var objs = function(){};

var timer; 

var langWindDir = new Array(
   "N", "NNE", "NE", "ENE", 
   "E", "ESE", "SE", "SSE", 
   "S", "SSW", "SW", "WSW", 
   "W", "WNW", "NW", "NNW");


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
        url: 'http://query.yahooapis.com',
        version: '*'
    });

    client.get("/v1/public/yql?q=SELECT%20*%20FROM%20weather.bylocation%20WHERE%20location%3D'"+ m_params.city +"'%20AND%20unit%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(err, req, res, obj) {

        if (err){
            console.log(err);
            setTimeout(pool, m_poolInterval * 2);
            return;
        }

        var channels = obj.query.results.weather.rss.channel;
        
        for (var key in channels){
            var value = channels[key];
            
            try{

                objs[key].create(value);
            }
            catch(err){

            }
        }

        client.close();
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

// ### atmosphere

objs.atmosphere = function () {};

    objs.atmosphere.create = function(atmosphere){

        for (var key in atmosphere){

            var value = atmosphere[key];
            
            var obj = {

                pooler : m_poolName,
                type : key,
                deviceId : "0",
                values : [{value : value}],
                actuators : []
            }

            m_db.save(m_poolName + "-" + key, obj);
        }
    }

// ### astronomy

objs.astronomy = function () {};

    objs.astronomy.create = function(astronomy){

        for (var key in astronomy){

            var value = astronomy[key];
            
            var obj = {

                pooler : m_poolName,
                type : key,
                deviceId : "0",
                values : [{value : value}],
                actuators : []
            }

            m_db.save(m_poolName + "-" + key, obj);
        }
    }

// ### wind

objs.wind = function () {};

    objs.wind.create = function(wind){

        for (var key in wind){

            var value = wind[key];

            if (key === "direction"){
                value = langWindDir[Math.floor(((parseInt(value) + 11) / 22.5) % 16 )];
                key = "wind_dir";
            }
            else if (key === "speed"){
                key = "wind_speed"
            }
            
            var obj = {

                pooler : m_poolName,
                type : key,
                deviceId : "0",
                values : [{value : value}],
                actuators : []
            }

            m_db.save(m_poolName + "-" + key, obj);
        }
    }

// ### item

objs.item = function () {};

    objs.item.create = function(item){

        var temp = item.condition.temp;

        var obj = {

            pooler : m_poolName,
            type : "temperature",
            deviceId : "0",
            values : [{value : temp}],
            actuators : []
        }

        m_db.save(m_poolName + "-" + "temperature", obj);
    }

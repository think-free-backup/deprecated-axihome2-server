
var restify = require('restify');

// ### Local variable definition

var objs = function(){};

var langWindDir = new Array(
   "N", "NNE", "NE", "ENE", 
   "E", "ESE", "SE", "SSE", 
   "S", "SSW", "SW", "WSW", 
   "W", "WNW", "NW", "NNW");


// ### run
// Params : name, poolInterval, params, db
// Start backend

exports.run = function(name, poolInterval, params, db){
    
    var timer;
    var parameters = {poolName : name, poolInterval : poolInterval, params : params, db : db, timer : timer};

    pool(parameters);
}

// ### pool
// Params : none
// Pooling function

function pool(params){

    var client = restify.createJsonClient({
        url: 'http://query.yahooapis.com',
        version: '*'
    });

    client.get("/v1/public/yql?q=SELECT%20*%20FROM%20weather.bylocation%20WHERE%20location%3D'"+ params.params.city +"'%20AND%20unit%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(err, req, res, obj) {

        if (err){
            console.log(err);
            setTimeout(pool, params.poolInterval * 2, params);
            return;
        }

        var channels = obj.query.results.weather.rss.channel;
        
        for (var key in channels){
            var value = channels[key];
            
            try{

                objs[key].create(params, value);
            }
            catch(err){

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

// ### atmosphere

objs.atmosphere = function () {};

    objs.atmosphere.create = function(params, atmosphere){

        for (var key in atmosphere){

            var value = atmosphere[key];
            
            var obj = {

                processor : "yahoo-weather",
                pooler : params.poolName,
                type : key,
                deviceId : "0",
                values : [{value : value}],
                actuators : [],
                type : "weather"
            }

            params.db.save(params.poolName + "-" + key, obj);
        }
    }

// ### astronomy

objs.astronomy = function () {};

    objs.astronomy.create = function(params, astronomy){

        for (var key in astronomy){

            var value = astronomy[key];
            
            var obj = {

                processor : "yahoo-weather",
                pooler : params.poolName,
                type : key,
                deviceId : "0",
                values : [{value : value}],
                actuators : [],
                type : "weather"
            }

            params.db.save(params.poolName + "-" + key, obj);
        }
    }

// ### wind

objs.wind = function () {};

    objs.wind.create = function(params, wind){

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

                processor : "yahoo-weather",
                pooler : params.poolName,
                type : key,
                deviceId : "0",
                values : [{value : value}],
                actuators : [],
                type : "weather"
            }

            params.db.save(params.poolName + "-" + key, obj);
        }
    }

// ### item

objs.item = function () {};

    objs.item.create = function(params, item){

        var temp = item.condition.temp;

        var obj = {

            processor : "yahoo-weather",    
            pooler : params.poolName,
            type : "temperature",
            deviceId : "0",
            values : [{value : temp}],
            actuators : [],
            type : "weather"
        }

        params.db.save(params.poolName + "-" + "temperature", obj);
    }

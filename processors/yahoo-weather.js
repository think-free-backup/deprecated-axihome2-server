// http://edg3.co.uk/snippets/weather-location-codes/spain/
// http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D%22SPXX0082%22&format=json
// http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.bylocation%20WHERE%20location%3D'Valencia'%20AND%20unit%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

// http://developer.yahoo.com/yql/console/?q=SELECT%20*%20FROM%20weather.bylocation%20WHERE%20location%3D'Nice'%20AND%20unit%3D%22c%22&env=store://datatables.org/alltableswithkeys#h=SELECT%20*%20FROM%20weather.bylocation%20WHERE%20location%3D%27Valencia%27%20AND%20unit%3D%22c%22


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
        url: 'http://query.yahooapis.com',
        version: '*'
    });

    client.get("/v1/public/yql?q=SELECT%20*%20FROM%20weather.bylocation%20WHERE%20location%3D'"+ m_params.city +"'%20AND%20unit%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(err, req, res, obj) {

        if (err){
            console.log(err);
            setTimeout(pool, m_poolInterval * 2);
            return;
        }

        console.log(obj.query.results.weather.rss.channel);

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
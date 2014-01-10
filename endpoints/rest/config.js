/* This endpoint is used for application configuration */

var db = require('../../lib/lib-database.js');

// ### getAllDevices
// Params : params
// Return all devices known by the system at this time

exports.getAllDevices = function(req,res,next){
    
    res.json(db.getAll());
}

// ### getAllDevicesId
// Params : params
// Return the identifier of all devices

exports.getAllDevicesId = function(req, res, next){
    
    var js = [];

    var mod = db.getAll();

    for (var key in mod){
        var value = mod[key];
        
        js.push(value.instance + "-" + value.type + "-" + value.deviceId);
    }

    res.json(js);
}

exports.getAllBackends = function(req, res, next){
	
}
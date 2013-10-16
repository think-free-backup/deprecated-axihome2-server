/* This endpoint is used for application configuration */

var db = require('../../lib/lib-memory-database.js');

// ### getAllModules
// Params : params
// Return all modules known by the system at this time

exports.getAllModules = function(req,res,next){
    
    res.json(db.getAll());
}

// ### getAllModulesNames
// Params : params
// Return the identifier of all modules

exports.getAllModulesId = function(req, res, next){
    
    var js = [];

    var mod = db.getAll();

    for (var key in mod){
        var value = mod[key];
        
        js.push(value.pooler + "-" + value.type + "-" + value.deviceId);
    }

    res.json(js);
}
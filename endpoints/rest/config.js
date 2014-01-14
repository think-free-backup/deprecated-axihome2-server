/* This endpoint is used for application configuration */

var db = require('../../lib/lib-database.js');
var config = require('../../../lib/lib-config');
var tools = require('../../lib/lib-tools.js');


/* Get the configuration */
/* ************************************************************ */

// ### getAllDevices
// Params : params
// Return all devices known by the system at this time

exports.getAllDevices = function(req,res,next){

    var dev = db.getAll();
    
    res.json(dev);
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

exports.getDevicesAssociation = function(req, res, next){

    res.json(config.load( '/config/devicesAssociation.json'));
}

// ### getAllBackends
// Params : params
// Return all backends availables

exports.getAllBackends = function(req, res, next){

	var backends = [];

	require("fs").readdirSync("./application/backends/").forEach(function(file) {

		backends.push(file);
	});
	res.json(backends);
}

// ### getConfigForbackend
// Params : params
// Return the configuration needed for the backend passed as parameter (name)

exports.getConfigForbackend = function(req, res, next){

	res.json( config.load( '/application/backends/' + req.params.name + '/config.json') );
}


// ### getAllInstances
// Params : params
// Return all the instances configured in the application

exports.getAllInstances = function(req, res, next){

    res.json( config.load( '/config/instances.json') );
}

exports.getPlaces = function(req, res, next){

    res.json(tools.getPlaces() );
}


/* Instance managment */
/* ************************************************************ */

exports.useInstance = function(req, res, next){

    var instList = config.load( '/config/instances.json');
    var name = req.params.name;
    var use = req.params.use;

    for(key in instList){

        var instance = instList[key];

        if (instance.name === name ){

            instance.active = (use === "true");
        }
    }

    config.write('/config/instances.json', instList);

    res.json(instList);    
}

exports.createInstance = function(req, res , next){

    var obj = new Object();

    obj.backend = req.params.backend;
    obj.name = req.params.name;
    obj.poolInterval = parseInt(req.params.poolInterval);
    obj.active = (req.params.active === "true");
    obj.params = JSON.parse(req.params.params);

    var instList = config.load( '/config/instances.json');

    instList.push(obj);

    config.write('/config/instances.json', instList);

    res.json(instList);
}

exports.deleteInstance = function(req, res, next){

    var instList = config.load( '/config/instances.json');

    // TODO : Delete instance with nane : req.params.name

    for (var key in instList){

        if ( instList[key].name === req.params.name){
            instList.splice(key,1);
        }
    }

    config.write('/config/instances.json', instList);

    res.json(instList);
}

/* Device association */
/* ************************************************************ */

exports.addAssociation = function(req, res, next){

    var device = req.params.device;
    var name = req.params.name;
    var place = req.params.place;

    var assoc = config.load( '/config/devicesAssociation.json');

    assoc.push({device : device, name : name, place : place});

    config.write('/config/devicesAssociation.json', assoc);

    res.json(assoc);
}

exports.removeAssociation = function(req, res, next){

    var device = req.params.device;
    var place = req.params.place;

    var assoc = config.load( '/config/devicesAssociation.json');

    for (var key in assoc){

        if ( assoc[key].device === device && assoc[key].place === place){

            assoc.splice(key,1);
        }
    }

    config.write('/config/devicesAssociation.json', assoc);

    res.json(assoc);
}
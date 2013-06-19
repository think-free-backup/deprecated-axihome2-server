
var soc = require("unified.socket/unified.socket.js");
var db = require('../../lib/lib-memory-database.js');
var config = require('../../../lib/lib-config');
var modules = config.load( '/config/modules.json')

// ### getAll
// Params : socket, params
// Get all devices

exports.getAllModules = function(socket, params){
    
    socket.send({type : "setVariable", body : {variable : "modules", option:  "", value : {modules : db.getAll() }}});
}

// ### getPlaces
// Params : socket, params
// Get all defined places

exports.getPlaces = function(socket, params){
    
    socket.send({type : "setVariable", body : {variable : "places", option:  "", value : {places : config.load( '/config/places.json')}}});
}

// ### getModulesAssociations
// Params : socket, params
// Get all module/places associations

exports.getModulesAssociation = function(socket, params){
    
    socket.send({type : "setVariable", body : {variable : "modulesAssociation", option:  "", value : {modulesAssociation : config.load('/config/modulesAssociation.json')}}});
}

// ### callModule
// Params : socket, params
// Call a processor function

exports.callModule = function(socket, params){

    try{

        var poolerParams = getParamsForModule(params[0], params[1]);
        var processor = require("/application/processors/" + params[0] + ".js");
        processor.write(poolerParams, params[2], params[3], params[4], params[5])
    }
    catch(err){

    }
}

function getParamsForModule(processor, pooler){

    for (var idx in modules){
        var value = modules[idx];
        
        if (value.pooler === pooler && value.processor === processor){

            return value.params;
        }
    }

    return undefined;
}

var soc = require("unified.socket/unified.socket.js");
var db = require('../../lib/lib-memory-database.js');
var config = require('../../../lib/lib-config');

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
    
    socket.send({type : "setVariable", body : {variable : "places", option:  "", value : {places : config.load('../../config/modules.json')}}});
}

// ### getModulesAssociations
// Params : socket, params
// Get all module/places associations

exports.getModulesAssociation = function(params){
    
    socket.send({type : "setVariable", body : {variable : "modulesAssociation", option:  "", value : {modulesAssociation : config.load('../../config/modulesAssociation.json')}}});
}
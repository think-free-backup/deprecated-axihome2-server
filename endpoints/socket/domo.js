/* Every functions for domo should come here (appart of variable binding and configuration) */

var soc = require("unified.socket/unified.socket.js");
var db = require('../../lib/lib-database.js');
var tools = require('../../lib/lib-tools.js');
var config = require('../../../lib/lib-config');
var modules = config.load( '/config/modules.json')

/* Get configuration */
/* *********************************************************************** */

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
    
    socket.send({type : "setVariable", body : {variable : "places", option:  "", value : {places : tools.getPlaces() }}});
}

// ### getModulesAssociations
// Params : socket, params
// Get all module/places associations

exports.getModulesAssociation = function(socket, params){
    
    socket.send({type : "setVariable", body : {variable : "modulesAssociation", option:  "", value : {modulesAssociation : config.load('/config/modulesAssociation.json')}}});
}

// ### getScenes
// Params : socket, params
// Get all the scenes for the application

exports.getScenes = function (socket, params){

	socket.send({type : "setVariable", body : {variable : "scenes", option:  "", value : {places : config.load( '/config/scenesAssociation.json')}}});
}

/* Call application */
/* *********************************************************************** */

// ### callModule
// Params : socket, params
// Call a processor function

exports.callModule = function(socket, params){


    tools.callModule(params[1], params[0], params[2], params[3], params[4], params[5])
}

exports.loadScene = function(socket, params){

	tools.loadScene(params[0]);
}

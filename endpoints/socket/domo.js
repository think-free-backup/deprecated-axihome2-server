/* Every functions for domo should come here (appart of variable binding and configuration) */

var soc = require("unified.socket/unified.socket.js");
var db = require('../../lib/lib-database.js');
var tools = require('../../lib/lib-tools.js');
var config = require('../../../lib/lib-config');

/* Get configuration */
/* *********************************************************************** */

// ### getAll
// Params : socket, params
// Get all devices

exports.getAllDevices = function(socket, params){
    
    socket.send({type : "setVariable", body : {variable : "devices", option:  "", value : {devices : db.getAllValues() }}});
}

// ### getPlaces
// Params : socket, params
// Get all defined places

exports.getPlaces = function(socket, params){
    
    socket.send({type : "setVariable", body : {variable : "places", option:  "", value : {places : tools.getPlaces() }}});
}

// ### getDevicesAssociations
// Params : socket, params
// Get all device/places associations

exports.getDevicesAssociation = function(socket, params){
    
    socket.send({type : "setVariable", body : {variable : "devicesAssociation", option:  "", value : {devicesAssociation : config.load('/config/devicesAssociation.json')}}});
}

// ### getScenes
// Params : socket, params
// Get all the scenes for the application

exports.getScenes = function (socket, params){

	socket.send({type : "setVariable", body : {variable : "scenes", option:  "", value : {places : config.load( '/config/scenesAssociation.json')}}});
}

/* Call application */
/* *********************************************************************** */

// ### callDevice
// Params : socket, params
// Call a backend function

exports.callDevice = function(socket, params){


    tools.callDevice(params[1], params[0], params[2], params[3], params[4], params[5])
}

// ### loadScene
// Params : socket, params
// Load a scene

exports.loadScene = function(socket, params){

	tools.loadScene(params[0]);
}

exports.writeVirtualDevice = function(socket, params){

	tools.writeVirtualDevice(params[0], params[1]);
}
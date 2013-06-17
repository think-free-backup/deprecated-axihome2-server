
var log = require("../../../lib/lib-log");
var db = require('../../lib/lib-memory-database.js');

// ### request
// Params : name, filter
// Request a variable to database

exports.request = function(socket, param){

    log.write("variableManager", "Variable request received : " + param[0] + " - " + param[1]);

    var variable = db.get(param[0]);

    if (variable !== undefined)
        socket.send({type : "setVariable", body : {variable : param[0], option:  "", value : variable }});
    else
        log.write("variableManager", "Variable not found : " + param[0]);
}

// ### release
// Params : name
// Release a variable on the database

exports.release = function(socket, param){
 
    log.write("variableManager", "Variable release received : " + param[0]);
}

// ### write
// Params : name, value
// Write a change to a variable on the database

exports.write = function(socket, param){
    
    log.write("variableManager", "Variable write received : " + param[0] + " - " + param[1]);
}

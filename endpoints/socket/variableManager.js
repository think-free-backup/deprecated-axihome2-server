
var log = require("../../../lib/lib-log");
var db = require('../../lib/lib-memory-database.js');

// ### request
// Params : name, filter
// Request a variable to database

exports.request = function(socket, param){

    log.write("variableManager", "Variable request received : " + param[0] + " - " + param[1]);

    socket.send({type : "setVariable", body : {variable : param[0], option:  "", value : m_db.get(param[0]) }});
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

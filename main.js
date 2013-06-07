
var log = require('../lib/lib-log');
var soc = require("unified.socket/unified.socket.js");
var db = require('./lib/lib-memory-database.js');

// ## Init and socket connection callback
/* ***************************************************************************** */

// ### init
// Params : none
// Init the application

exports.init = function(config){
    
    log.write("on-domo", "Starting application");

    var call_list = require('../lib/lib-config').load('./config/modules.json');
    var poolers = [];

    require("fs").readdirSync("./application/processors/").forEach(function(file) {

        var name = file.split(".js")[0];
        poolers[name] = require("./processors/" + file);
        log.write(config.server, "Loading application data processors : " + name);
    });

    for (var idx in call_list){

        var p = call_list[idx];
        if (p.active)
            poolers[p.processor].run(p.name, p.poolInterval, p.params, db);
    }

    db.setSaveCallback(function(message){

        soc.broadcast({type : "setVariable", body : {variable : "mainMenu", option:  "", value : {modules : message }}});
    });
}

// ### clientConnected
// Params : socket
// Client connected to socket callback

exports.clientConnected = function(socket){

    console.log("Client connected : " + socket.host() + ":" + socket.port());
}

// ### clientDisconnected
// Params : socket
// Client disconnected callback

exports.clientDisconnected = function(socket){
 
    console.log("Client disconnected : " + socket.host() + ":" + socket.port());   
}

// ## Login/Logout managment
/* ***************************************************************************** */

// ### login
// Params : user, password
// Login a user
// Return :
// {type : "ssid", body : sessionId} 
// {type : "login-error", body : "User/Password invalid"}

exports.login = function(user,password,device,callback){

}

// ### logout
// Params : session
// Logout a user by his session

exports.logout = function(session){
    
}

// ### name
// Params : params
// Description
// Return :
// {valid : false, message : "Reason
// {valid : true, message : sessions[session].Expiration, session : sessions[session]}"}

exports.isSessionValid = function(session){
    
}

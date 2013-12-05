var log = require('../../lib/lib-log');

var m_db = [];
var m_callback = undefined;

// ### save
// Params : pool, type, devName, device
// Save an object in memory

exports.save = function(key, value){
    
    if ( m_db[key] === undefined || JSON.stringify(m_db[key]) !== JSON.stringify(value) ){

        log.write("lib-database::save","Value of key '" + key + "' changed");
        m_db[key] = value;

        if (m_callback != undefined)
            m_callback(key,value);    
    }
}

// ### get
// Params : key
// Get an entry

exports.get = function(key){

    return m_db[key];
}

// ### getAllDevices
// Params : params
// Description

exports.getAll = function(){
    
    var devices = [];

    for (var idx in m_db){
        var device = m_db[idx];
        devices.push(device);
    }

    return devices;
}

// ### setSaveCallback
// Params : callback
// Set the callback function for all save action

exports.setSaveCallback = function(callback){

    m_callback = callback;
}
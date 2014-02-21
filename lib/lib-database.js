var log = require('../../lib/lib-log');
var config = require('../../lib/lib-config').load('/config/config.json');

var m_db = {};
var m_callback = undefined;

var couch;

if (config.useCouch){

    var cradle = require('cradle');

    couch = new(cradle.Connection)(config.couchHost, config.couchPort, {
                cache: true,
                raw: false,
                forceSave: true
            }).database('axihome');
}

// ### save
// Save an object in memory

exports.save = function(key, value){
    
    if ( m_db[key] === undefined || JSON.stringify(m_db[key]) !== JSON.stringify(value) ){

        log.write("lib-database::save","Value of key '" + key + "' changed");
        m_db[key] = value;

        if (m_callback != undefined)
            m_callback(key,value);    

        if(config.useCouch){

            log.write("lib-database::save", "Writting key " + key + " to database");

            var now = Math.round(new Date().getTime() / 1000);
            couch.save(key + "-" + now, value );
        }
    }
}

exports.remove = function(key){

    log.write("lib-database::remove","Removing object '" + key + "'");

    delete m_db[key];
}

// ### get
// Params : key
// Get an entry

exports.get = function(key){

    return m_db[key];
}

// ### dump
// Params : none
// Dump the database content

exports.dump = function(){

    return m_db;
}

// ### getAllKeys
// Params : none
// Get all keys

exports.getAllKeys = function(){
    
    var values = [];

    for (var idx in m_db){

        values.push(idx);
    }

    return values;
}

// ### getAllValues
// Params : params
// Get all values

exports.getAllValues = function(){
    
    var values = [];

    for (var idx in m_db){
        var value = m_db[idx];
        values.push(value);
    }

    return values;
}

// ### setSaveCallback
// Params : callback
// Set the callback function for all save action

exports.setSaveCallback = function(callback){

    m_callback = callback;
}
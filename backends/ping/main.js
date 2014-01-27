
var ping = require('pingwrap/lib/ping.js');

var m_db;
var m_name;

exports.run = function(name, poolInterval, params, db){

	m_db = db;
	m_name = name;

	var parameters = {instanceName : name, poolInterval : poolInterval, params : params};

	pool(parameters);
}

function pool(params){

	ping(params.params.host, function(error, stdout, stderr) {

		var obj = {
			
			backend : "ping",
		    instance : params.instanceName,
		    type : "ping",
		    deviceId : "0",
		    values : [{value : true}],
		    actuators : [],
		    group : "presence"
		}

	    if (error){

	    	obj.values[0].value = false;
	    }

	    m_db.save(m_name + "-" + "ping-0", obj);
	});

	setTimeout(pool, params.poolInterval, params);
}
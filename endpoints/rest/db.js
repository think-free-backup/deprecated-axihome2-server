var restify = require('restify');

exports.get = function(req, res, next){



var url = "http://172.16.1.6:5984/axihome/_design/getDeviceHistory/_view/getDeviceHistory?startkey=%22homeWeatherStation-temperature-1-0%22&endkey=%22homeWeatherStation-temperature-1-9%22";

    var client = restify.createJsonClient({
        url: 'http://172.16.1.6:5984/',
        version: '*'
    });

    client.get('/axihome/_design/getDeviceHistory/_view/getDeviceHistory?startkey="homeWeatherStation-temperature-1-0"&endkey="homeWeatherStation-temperature-1-9"' , function(cerr, creq, cres, cobj) {

      var val = [];

      for(var k in cobj.rows){

	var item = cobj.rows[k];

	var v = [item.value.timestamp * 1000, item.value.object.values[0].value];
	val.push(v);
      }

      res.json(val);
    })
};




var soc = require("unified.socket/unified.socket.js");
var db = require('../../lib/lib-database.js');
var tools = require('../../lib/lib-tools.js');
var config = require('../../../lib/lib-config');
var modules = config.load( '/config/modules.json')

exports.loadScene = function(req,res,next){
    
    tools.loadScene(req.params.name, function(ret){

    	if (ret === true)
    		res.json({type : "ok", body : "Scene loaded"});	
    	else
    		res.json({type : "error", body : ret.code});	
    });
}

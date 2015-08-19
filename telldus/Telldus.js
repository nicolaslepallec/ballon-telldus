var config = require('../telldus/telldusConfig')
var OAuth = require('oauth');
var JSONPath = require('JSONPath');

var URL='http://api.telldus.com';
var REQUEST_URI=URL+'/json';

var STATE_ON=1;
var STATE_OFF=2;

var TURN_ON=1;
var TURN_OFF=2;

var TURN_ON_CALL="/device/turnOn";
var TURN_OFF_CALL="/device/turnOff";
var HISTORY_CALL="/device/history";

var oauth = new OAuth.OAuth(
  URL+'/oauth/requestToken',
  URL+'/oauth/accessToken',
  config.PublicKey,
  config.PrivateKey,
  '1.0',
  null,
  'HMAC-SHA1'
);

function get(APIcall, callback){
	oauth.get(
  REQUEST_URI+APIcall,
  config.Token,
  config.TokenSecret,
  function (error, data, response){
    if (error){
    	console.error(error);
    	callback(error);
    }else{
    	 // data = JSON.parse(data);
   		 // console.log(JSON.stringify(data, 0, 2));
    	callback(JSON.parse(data));
    }
   
   });
}

function switchDeviceState(deviceID, action, callback){
	var call="";
	switch (action){
		case TURN_ON:
		console.log(":: TURN ON device "+deviceID);
		call=TURN_ON_CALL
		break;
		case TURN_OFF:
		console.log(":: TURN OFF device "+deviceID);
		call=TURN_OFF_CALL
		break;
	}

	get(call+"?id="+deviceID, function(data){
		console.log(data);
		callback(data);
	});

}

function getDeviceLastState(deviceID, callback){
	var timestamp=new Date().getTime()+3600;
	get(HISTORY_CALL+"?id="+deviceID+"&to="+timestamp, function(data){
		//console.log(data);
		var state=JSONPath.eval(data,'$.history[-1:].state')[0];
		console.log(state);
		callback(state);
	});

}
exports.get=get;
exports.switchDeviceState=switchDeviceState;
exports.getDeviceLastState=getDeviceLastState;
exports.STATE_ON=STATE_ON;
exports.STATE_OFF=STATE_OFF;
exports.TURN_ON=TURN_ON;
exports.TURN_OFF=TURN_OFF;
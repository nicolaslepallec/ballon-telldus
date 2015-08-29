var Telldus = require('../telldus/Telldus');
var lightMg = require('../models/light');
var config = require('../telldus/lightConfig');
var presets = require('../telldus/lightPresets');
var JSONPath = require('JSONPath');
var fs = require('fs');
var OFF = "off";
var ON = "on";


function setPreset(presetID, callback) {
    //JSONPath$..book[?(@.price<10)]
    var lights=[];
    var preset=JSONPath.eval(presets,"$.presets[?(@.name=='"+presetID+"')]")[0];
    console.log(preset);
    for(i in preset.preset){
        var deviceName=preset.preset[i].device;
        var deviceObj=config[deviceName];
        console.log(deviceObj);
        getLightFromDB(deviceObj, preset.preset[i].level, function(light) {
             console.log(light);
            setLightLevel(light, function(data){

                    console.log(data);
                    callback(data);
            });
        });
        //getLightFromDB()
    }
    /*getBallonFromDB(mode, function(light) {
        var stateCSSOnEco = 'off';
        var stateCSSForceOn = 'off';
        var stateCSSOff = 'off';
        var StateToSwitchBallon = OFF;
        switch (ballon.mode) {
            case ON_ECO:
                console.log("->ON_ECO");
                stateCSSOnEco = 'on';
                if (isEcoHour()) {
                    StateToSwitchBallon = ON;
                } else {
                    console.log("ste change to ON but ballon is kept OFF until ECO hour start");
                    StateToSwitchBallon = OFF;
                }
                break;
            case FORCE_ON:
                console.log("->FORCE_ON");
                stateCSSForceOn = 'on';
                StateToSwitchBallon = ON;
                break;
            case OFF:
                console.log("->OFF");
                stateCSSOff = 'on';
                StateToSwitchBallon = OFF;
                break;
        }
        switchBallon(StateToSwitchBallon, function(data) {
            Telldus.getDeviceLastState(config.BALLON_TELLDUS_ID, function(ballonState) {
                console.log("Device current state is :: " + ballonState);
                ballon.state = ballonState;
                callback(ballon);
    

            });
        });

    });*/

}

function getLightFromDB(lightObj, level, callback) {
    lightMg.findOne({
        'id': lightObj.id
    }, function(err, light) {
        if (err) callback(err);

        // if the ballon is found
        if (light) {
            console.log(light.id+" is dimmable :: "+light.isDimmable);
            light.level=level;
            light.save(function(err) {
                if (err)
                    throw err;

                // if successful, return the light
                callback(light);
            });
            //callback(light); // user found, return that user
        } else {
            // if there is no ballon found with that Telldus id, create it
            var newLight = new lightMg();
            newLight.id = lightObj.id;
            newLight.isDimmable = eval(lightObj.dimmable);
            newLight.level=level;
            console.log(lightObj.id+" is dimmable :: "+newLight.isDimmable);
            //default to off if undefined
           
            newLight.save(function(err) {
                if (err)
                    throw err;

                // if successful, return the new user
                callback(newLight);
            });
        }

    });

}


function setLightLevel(light, callback) {
    console.log("light.isDimmable "+light.isDimmable);
    if(light.isDimmable){
      Telldus.dimDevice(light.id,light.level, function(data) {
        console.log(data);
        callback(data);
     });  
    } else{
        var telldusState = Telldus.TURN_OFF
        console.log("TURUN IT ON STATE :: "+telldusState);
        if (light.level == ON) {
            //switch ballon ON
            telldusState = Telldus.TURN_ON

        }
        Telldus.switchDeviceState(light.id,telldusState, function(data) {
            console.log(data);
            callback(data);
         });  
    }
    

}

function getLightRealState(callback) {
    Telldus.getDeviceLastState(config.BALLON_TELLDUS_ID, function(state) {
        callback(state);
    });
}
//setPreset("TV");
module.exports.setPreset = setPreset;
module.exports.OFF = OFF;
module.exports.ON = ON;
module.exports.getLightRealState=getLightRealState;
module.exports.presets=presets;
var Telldus = require('../telldus/Telldus');
var ballonMg = require('../models/ballon');
var config = require('../telldus/ballonConfig');
//var JSONPath = require('JSONPath');
var fs = require('fs');
var ON_ECO = "on-eco";
var FORCE_ON = "force-on";
var OFF = "off";
var ON = "on";
var ballonRealState = "";
var state_ballon = OFF;
//var BALLON_TELLDUS_ID = "839364";

//ECO HOURS
var ECO_HOUR_START = 0;
var ECO_HOUR_FINISH = 8;


function setState(mode, callback) {

    getBallonFromDB(mode, function(ballon) {
        var stateCSSOnEco = 'off';
        var stateCSSForceOn = 'off';
        var stateCSSOff = 'off';
        var StateToSwitchBallon = false;
        switch (mode) {
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
        if(StateToSwitchBallon){
            switchBallon(StateToSwitchBallon, function(data) {
                Telldus.getDeviceLastState(config.BALLON_TELLDUS_ID, function(ballonState) {
                    console.log("Device current state is :: " + ballonState);
                    ballon.state = ballonState;
                    callback(ballon);
                    /*var circleColor = "";
                    switch (ballon.state) {
                        case Telldus.STATE_OFF:
                            circleColor = "red";
                            break;
                        case Telldus.STATE_ON:
                            circleColor = "green";
                            break;
                    }
                    var html = String(fs.readFileSync("ballon.html"));
                    html = html.replace("{classOnEco}", stateCSSOnEco);
                    html = html.replace("{classForceOn}", stateCSSForceOn);
                    html = html.replace("{classOff}", stateCSSOff);
                    html = html.replace("{circleColor}", circleColor);
                    callback(html);*/

                });
            });
        }else{
            callback(ballon);
        }
        

    });

}

function getBallonFromDB(mode, callback) {
    ballonMg.findOne({
        'id': config.BALLON_TELLDUS_ID
    }, function(err, ballon) {
        if (err) callback(err);

        // if the ballon is found
        if (ballon) {
            if (mode != "") {
                ballon.mode = mode;
                ballon.save();
            }
            callback(ballon); // user found, return that user
        } else {
            // if there is no ballon found with that Telldus id, create it
            var newBallon = new ballonMg();
            newBallon.id = config.BALLON_TELLDUS_ID;
            //default to off if undefined
            if (mode == "") mode = OFF;
            newBallon.mode = mode;
            newBallon.save(function(err) {
                if (err)
                    throw err;

                // if successful, return the new user
                callback(newBallon);
            });
        }

    });

}

function isEcoHour() {
    var date = new Date();
    var current_hour = date.getHours();
    console.log("current hour is : " + current_hour);
    if (current_hour >= ECO_HOUR_START && current_hour < ECO_HOUR_FINISH) {
        return true;
    } else {
        return false;
    }
}

function switchBallon(state, callback) {
    var telldusState = Telldus.TURN_OFF
    console.log("TURUN IT ON STATE :: "+state);
    if (state == ON) {
        //switch ballon ON
        telldusState = Telldus.TURN_ON

    }
    Telldus.switchDeviceState(config.BALLON_TELLDUS_ID, telldusState, function(data) {
        console.log(data);
        callback(data);
    });

}

function getBallonRealState(callback) {
    Telldus.getDeviceLastState(config.BALLON_TELLDUS_ID, function(state) {
        callback(state);
    });
}

module.exports.setState = setState;
module.exports.ON_ECO = ON_ECO;
module.exports.OFF = OFF;
module.exports.ON = ON;
module.exports.FORCE_ON = FORCE_ON;
module.exports.getBallonRealState=getBallonRealState;
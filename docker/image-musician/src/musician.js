var dgram = require('dgram');
var uuid = require('uuid'); // https://www.npmjs.com/package/uuid
var moment = require('moment');

var s = dgram.createSocket('udp4');

var musician  = new Object();
musician.uuid = uuid();
musician.instrument = process.argv[2];
var sound;
switch(musician.instrument){
    case "piano":
        sound = "ti-ta-ti";
        break;
    case "trumpet":
        sound = "pouet";
        break;
    case "flute":
        sound = "trulu";
        break;
    case "violin":
        sound = "gzi-gzi";
        break;
    case "drum":
        sound = "boum-boum";
        break;
    default:
        sound = "undefined";
        break;
}
musician.sound = sound;

var payload = JSON.stringify(musician);

setInterval(function(){
    message = new Buffer(payload);
    s.send(message, 0, message.length, 2205, "239.255.22.5", function(err, bytes){}); // We send to the multicast adress.
}, 1000);


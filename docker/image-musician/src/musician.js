var dgram = require('dgram');
var uuid = require('uuid'); // https://www.npmjs.com/package/uuid
var s = dgram.createSocket('udp4');

const PORT = 2205
const ADDRESS = "239.255.22.5"
const INTERVAL = 1000

// Creating a musician from the arguments
var musician  = new Object();
musician.uuid = uuid();
musician.instrument = process.argv[2];

// Give the musician his sound by checking his instrument.
switch(musician.instrument){
    case "piano":
        musician.sound = "ti-ta-ti";
        break;
    case "trumpet":
        musician.sound = "pouet";
        break;
    case "flute":
        musician.sound = "trulu";
        break;
    case "violin":
        musician.sound = "gzi-gzi";
        break;
    case "drum":
        musician.sound = "boum-boum";
        break;
    default:
        musician.sound = "undefined";
        break;
}


var payload = JSON.stringify(musician);

// Call the fonction every INTERVAL ms
setInterval(function(){
    message = new Buffer(payload);
    s.send(message, 0, message.length, PORT, ADDRESS, function(err, bytes){}); // We send to the multicast adress.
}, INTERVAL);


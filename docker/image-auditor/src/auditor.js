var dgram = require('dgram');
var net = require('net');
var moment = require('moment');

const PORT = 2205;
const ADDRESS = "239.255.22.5";
const TIME_OUT = 5000;

var s = dgram.createSocket('udp4');

var musicianMap = new Map();

// Bind the server to the multicast address so it can listen for messages on it
s.bind(PORT, function(){
   console.log("The auditor is now in the multicast group on port " + PORT);
   s.addMembership(ADDRESS);
});

// Define what we do when a message is received
s.on('message', function(msg, src){
   console.log("A message has been received " + msg);

   // Create a musician from the received message
   var receivedMusician = JSON.parse(msg);

    // We check if we already received a message from this musician
    if(musicianMap.has(receivedMusician.uuid)){
        // if it's the case, we update the timestamp
        musicianMap.get(receivedMusician.uuid).lastMessage = moment();
    }else{
        // Otherwise, we create a new musician with the received one informations
        var newMusician = new Object();
        newMusician.uuid = receivedMusician.uuid;
        newMusician.instrument = receivedMusician.instrument;
        newMusician.sound = receivedMusician.sound;
        newMusician.lastMessage = moment();
        newMusician.firstMessage = moment();
        musicianMap.set(newMusician.uuid, newMusician);
    }
});

// Creating the TCP server
var serverTCP = net.createServer(function(socket){
    musicianMap.forEach(function(item, key, musicianMap){
        // If the musician hasn't played for TIME_OUT ms, delete it from the map
        if(moment().diff(item.lastMessage) > TIME_OUT ){
            console.log(JSON.stringify(item) + " is being deleted.")
            musicianMap.delete(key);
        }
    });
    socket.write(JSON.stringify(musicianMap));
    socket.end();
}

// Making our server listening on the right port
serverTCP.listen(PORT);
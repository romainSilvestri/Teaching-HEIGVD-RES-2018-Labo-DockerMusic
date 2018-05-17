var dgram = require('dgram');
var net = require('net');
var moment = require('moment');

const PORT = 2205;
const ADDRESS = "239.255.22.5";
const TIME_OUT = 5000;

var s = dgram.createSocket('udp4');

// If we use a map instead, validation fails so we go back to arrays
var musicianArray = [];

// Bind the server to the multicast address so it can listen for messages on it
s.bind(PORT, function () {
    console.log("The auditor is now in the multicast group on port " + PORT);
    s.addMembership(ADDRESS);
});

// Define what we do when a message is received
s.on('message', function (msg, src) {
    console.log("The message " + msg + " has been received from " + src);

    // Create a musician from the received message
    var receivedMusician = JSON.parse(msg);

    // We check if we already received a message from this musician
    for (var i = 0; i < musicianArray.length; i++) {
        if (musicianArray[i].uuid == receivedMusician.uuid) {
            musicianArray[i].lastMessage = moment();
            return;
        }
    }

    // If the musician is not in the array
    receivedMusician.lastMessage = moment();
    musicianArray.push(receivedMusician);
});

// Creating the TCP server
var serverTCP = net.createServer(function (socket) {
    for (var i = 0; i < musicianArray.length; i++) {
        // If the musician hasn't played for TIME_OUT ms, delete it from the array
        if (moment().diff(musicianArray[i].lastMessage) > TIME_OUT) {
            console.log(JSON.stringify(musicianArray[i]) + " is being deleted.")
            musicianArray.splice(i, 1);

        }
    }

    socket.write(JSON.stringify(musicianArray));
    socket.end();
});

// Making our server listening on the right port
serverTCP.listen(PORT);
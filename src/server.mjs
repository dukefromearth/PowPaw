// Dependencies.
/*jshint esversion: 6 *///
import express from 'express';
import http from 'http';
import path from 'path';
import socketIO from 'socket.io';
import SerialPort from 'serialport';

const __dirname = path.resolve(path.dirname(''));
const environment = process.env.ENV || "prod";
var num_users = 0;
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const port_num = 5000;

app.set('port', port_num);
app.use('/src', express.static('./src'));

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '/index.html'));
});

server.listen(port_num, function () {
    console.log(`Running as ${environment} environment`);
    console.log('Starting server on port', port_num);
});

io.on('connection', function (socket) {
    num_users++;
    socket.on('new player', function () {
        console.log("new player");
    });
});

//Set the serial port where your arduino is
const port = new SerialPort('/dev/cu.usbserial-144210', {
    baudRate: 9600
});

var notes = {
    C5: 0,
    D5: 0,
    E5: 0,
    E6: 0
}

//Read from the serial port and parse into notes
port.on('readable', function () {
    let lineStream = port.read();
    lineStream = lineStream.toString();
    // console.log("stream" + lineStream);
    lineStream = JSON.parse(lineStream);
    notes["C5"] = lineStream[0];
    notes["D5"] = lineStream[1];
    notes["E5"] = lineStream[2];
    notes["F5"] = lineStream[3];
});

//Clears all the notes from our note object
const clearNotes = () => {
    for (let i in notes) {
        notes[i] = 0;
    }
}

//If a note note is hit, send the notes through the websocket.
const run = () => {
    for (let i in notes) {
        let note = notes[i];
        if(note) {
            io.emit('notes', notes);
            clearNotes();
            return;
        }
    }
}

setInterval(function () {
    run();
}, 1000 / 120);
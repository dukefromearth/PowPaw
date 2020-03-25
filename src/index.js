const socket = io();
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
notes = [];

socket.emit('new player');

//Triggers when we recieve a new hit from the server
socket.on('notes', function (notes_from_server) {
    notes = notes_from_server;
});

//Clears out all the note velocities
const clearNotes = () => {
    for (let i in notes) {
        notes[i] = 0;
    }
}

//If a note velocity is above 0, trigger a sound
const run = () => {
        for (let i in notes) {
            let velocity = notes[i];
            if (velocity > 0) {
                //This is where you trigger the note
                console.log("Note hit: " + i);
                console.log("Velocity: " + velocity + '\n');
            }
        }
    clearNotes();
    requestAnimationFrame(run);
}

run();
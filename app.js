const express = require('express');
const app = express();
const http = require('http').createServer(app); // Create an HTTP server instance
const io = require('socket.io')(http); // Integrate Socket.IO with the HTTP server

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define WebSocket event handlers
io.on('connection', (socket) => {
    console.log('A user connected.');

    // Handle incoming messages from the frontend
    socket.on('messageFromClient', (data) => {
        console.log('Message from client:', data);

        // Send a response back to the frontend
        socket.emit('messageFromServer', 'Hello from the server!');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

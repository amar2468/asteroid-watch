// Import the Express framework
const express = require('express');

// Import CORS middleware to allow cross-origin requests (from React to backend)
const cors = require('cors');

const asteroidRoutes = require('./routes/asteroids');

// Load environment variables from .env file
require('dotenv').config();

// Create an Express application
const app = express();

// Enable CORS so frontend (on a different port) can access the backend
app.use(cors());

app.use('/api/asteroids', asteroidRoutes);

// Root URL, with a basic message.
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start the server and listen on port 4000
app.listen(4000, () => {
    console.log("Server listening on port 4000")
});
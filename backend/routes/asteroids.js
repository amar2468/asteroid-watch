// Import the Express framework
const express = require('express');

// Importing the axios framework, to make API requests.
const axios = require('axios');

// Imported Router, which is needed when calling the routes below.
const router = express.Router();

// When the /api/asteroids route is called, we will make an API call to retrieve the NEO data from a specific date.
router.get('/', async (req, res) => {
    const date = req.query.date;

    const apiKey = process.env.NASA_API_KEY;

    if (!date) {
        return res.status(400).json({ error: 'Date is required.'});
    }

    try {
        const neoURL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;

        const response = await axios.get(neoURL);

        const neos = response.data;

        res.json({ neos });
    }

    catch (error) {
        console.log(error.message);

        res.status(500).json({ error: 'Failed to fetch NEO data' });
    }
});

module.exports = router;
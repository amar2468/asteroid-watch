// Import the Express framework
const express = require('express');

// Importing the axios framework, to make API requests.
const axios = require('axios');

// Imported Router, which is needed when calling the routes below.
const router = express.Router();

router.post('/', async (req, res) => {
    const { startDate, endDate } = req.body;

    const apiKey = process.env.NASA_API_KEY;

    // If the start date is missing, throw a 400 error message about it.
    if (!startDate) {
        return res.status(400).json({ error: 'Start date is required.'});
    }

    // If the end date is missing, throw a 400 error message about it.
    if (!endDate) {
        return res.status(400).json({ error: 'End date is required.'});
    }

    try {
        const neoURL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

        const response = await axios.get(neoURL);

        const neos = response.data;

        return res.status(200).json({ data: neos });
    }

    catch (error) {
        console.log(error.message);

        return res.status(500).json({ error: 'Failed to fetch NEO data' });
    }
});

module.exports = router;
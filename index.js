const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

// Your private app access token should be stored in the .env file
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

// Route for the homepage
app.get('/', async (req, res) => {
    try {
        // Replace with your API call to get custom objects
        const response = await axios.get('https://api.hubapi.com/crm/v3/objects/custom_objects', {
            headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
        });
        const records = response.data.results;
        res.render('homepage', { title: 'Custom Objects List', records: records });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving custom objects');
    }
});

// Route to render the HTML form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Route to handle form submissions
app.post('/update-cobj', async (req, res) => {
    const { name, description, category } = req.body;
    try {
        // Replace with your API call to create a new custom object
        await axios.post('https://api.hubapi.com/crm/v3/objects/custom_objects', {
            properties: {
                name,
                description,
                category
            }
        }, {
            headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating custom object');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


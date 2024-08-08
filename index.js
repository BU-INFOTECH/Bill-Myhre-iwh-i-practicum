const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

// Your private app access token should be stored in the .env file
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

console.log(`HubSpot API Key: ${PRIVATE_APP_ACCESS}`);

// Replace `custom_object` with the actual custom object API name
const CUSTOM_OBJECT_API_NAME = '2-32243699';  // Assuming 2-32243699 is the object type ID for "pets"

// Route for the homepage
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_API_NAME}`, {
            headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
        });
        console.log('API Response:', response.data);
        const records = response.data.results;
        console.log('Records:', records);
        res.render('homepage', { title: 'Custom Objects List', records: records });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
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
        await axios.post(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_API_NAME}`, {
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
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


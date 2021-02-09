const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

/* привзяка действий по маршруту localhost:5000/
 * или просто localhost:5000*/
app.get('/', (req, res) => {
    /*Не надо вводить Headers key
     * express сам определит к какому типу относиться*/

    // res.send({ name: 'Brad' });
    // res.json({ name: 'Brad' });
    res.send('<h1>Hello from express</h1>');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on -${process.env.NODE_ENV}- mode on port -${PORT}-`
    );
});

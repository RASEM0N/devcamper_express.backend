const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

/* привзяка действий по маршруту localhost:5000/
 * или просто localhost:5000*/
app.get('/', (req, res) => {
    // res.sendStatus(400);
    // res.status(400).json({ success: false });
    res.status(200).json({
        success: true,
        data: {
            id: 1,
            name: 'Roman',
        },
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on -${process.env.NODE_ENV}- mode on port -${PORT}-`
    );
});

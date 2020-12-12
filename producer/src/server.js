require('dotenv').config();
const express = require('express');
const queue = require('./services/queue');

const { PORT } = process.env;

const app = express();
app.use(express.json());

app.post('/message', async (req, res) => {
    const { codigo } = req.body;
    queue.sendToQueue('produtos', req.body);

    res.send({ codigo });
});

app.listen(PORT, () =>
    console.log(`Server running at port: ${PORT}`)
);
const express = require('express');
const Service = require('./services/api-service');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const { codigo, produtos } = req.body;

    const response = await Service.simulate(codigo, produtos);
    res.send(response.data);
});

app.listen(3000, () =>
    console.log("Server running at port: 3000")
);
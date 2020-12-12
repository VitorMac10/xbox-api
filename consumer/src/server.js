require('dotenv').config();
const express = require('express');
const worker = require('./worker');

const { PORT } = process.env;

const app = express();
app.use(express.json());

app.get('/task/:codigo', (req, res) => {
    const { codigo } = req.params;

    if (!worker.has(codigo)) {
        return res.send({ message: 'Código inválido' });
    }

    const object = worker.get(codigo);
    if (!object.status) {
        worker.delete(codigo);
    }

    res.send(object);
});

app.listen(PORT, () =>
    console.log(`Server running at port: ${PORT}`)
);
const queue = require('./services/queue');
const Service = require('./services/api-service');

console.log("===== Queue worker started! =====");

const mensagens = new Map();

queue.consume('produtos', async (message) => {
    const content = message.content.toString();
    const { codigo, produtos } = JSON.parse(content);

    mensagens.set(String(codigo), {
        status: 'PROCESSING',
        message: 'Mensagem sendo processada'
    });

    const { data } = await Service.simulate(codigo, produtos);
    mensagens.set(String(codigo), data);
});

module.exports = class Worker {
    static get(codigo) {
        return mensagens.get(String(codigo));
    }

    static has(codigo) {
        return mensagens.has(String(codigo));
    }

    static delete(codigo) {
        mensagens.delete(String(codigo));
    }
}
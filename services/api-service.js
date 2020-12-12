const Axios = require('axios').default;

const axios = Axios.create({
    baseURL: 'https://dojo-api.gateway.linkapi.com.br/v1',
    maxRedirects: 20,
    headers: {
        'Authorization': 'Basic MDBiNWFlMTBlYzgyNGVjM2JmNjQyOGEzOGM4ODFhYTQ6NWRlZDc3ZjIwZDM0NDc5MjliYmE2Y2RiYWM1ZDc1YjA='
    }
});

module.exports = class Service {

    static async simulate(codigo, products = []) {
        const payload = {
            id: codigo,
            itens: products.map(({
                nome: name,
                codigo: id,
                preco: price
            }) => ({ name, id, price }))
        };

        const response = await axios.post('/simulate', payload);
        const { data: message } = response;

        if (message.approved) {
            return axios.post('/message', {
                ...payload, simulationId: message.id
            });
        }

        return axios.post('/error-stack', {
            id: message.id
        });
    }
}
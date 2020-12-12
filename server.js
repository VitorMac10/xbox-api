
var express = require('express')
var bodyParser = require('body-parser')
var https = require('https')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(function (req, res) {

    var body = req.body

    var options = {
        'method': 'POST',
        'hostname': 'dojo-api.gateway.linkapi.com.br',
        'path': '/v1/simulate',
        'headers': {
            'Authorization': 'Basic MDBiNWFlMTBlYzgyNGVjM2JmNjQyOGEzOGM4ODFhYTQ6NWRlZDc3ZjIwZDM0NDc5MjliYmE2Y2RiYWM1ZDc1YjA='
        },
        'maxRedirects': 20
    }

    var reqBody = {
        id: body.codigo,
        itens: []
    };

    for (var i = 0; i < body.produtos.length; i++) {
        reqBody.itens.push({
            name: body.produtos[i].nome,
            id: body.produtos[i].codigo,
            price: body.produtos[i].preco,
        })
    }

    res.setHeader('Content-Type', 'application/json')

    var request = https.request(options, function (response) {

        var chunks = []

        response.on("data", function (chunk) {
            chunks.push(chunk)
        })

        response.on("end", function () {
            var responseBody = JSON.parse(Buffer.concat(chunks).toString())

            if (responseBody && responseBody.approved) {

                options.path = '/v1/message';
                reqBody.simulationId = responseBody.id

                var requestSuccess = https.request(options, function (response) {

                    var chunks = []

                    response.on("data", function (chunk) {
                        chunks.push(chunk)
                    })

                    response.on("end", function () {
                        var body = JSON.parse(Buffer.concat(chunks).toString())
                        res.end(JSON.stringify(body, null, 2))
                    })

                    response.on("error", function (error) {
                        console.error(error)
                    })

                })
                requestSuccess.write(JSON.stringify(reqBody));
                requestSuccess.end()
            } else {
                options.path = '/v1/error-stack';
                reqBody = { id: reqBody.id }

                var requestError = https.request(options, function (response) {

                    var chunks = []

                    response.on("data", function (chunk) {
                        chunks.push(chunk)
                    })

                    response.on("end", function () {
                        var body = JSON.parse(Buffer.concat(chunks).toString())
                        res.end(JSON.stringify(body, null, 2))
                    })

                    response.on("error", function (error) {
                        console.error(error)
                    })

                })
                requestError.write(JSON.stringify(reqBody));
                requestError.end()
            }

        })

        response.on("error", function (error) {
            console.error(error)
        })

    })

    var postData = JSON.stringify(reqBody);

    request.write(postData);

    request.end()

})

app.listen(3000, function () {
    console.log("Server running at port: 3000")
})
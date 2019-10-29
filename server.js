const express = require('express');
const {
    httpServerAddress: {port, host},
    httpProxyServerAddress: {host: proxyHost}} = require('./etc/config');
const { Mapping } = require('./lib/sequelize');
const request = require('request');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());


app.post('/hello/register', (req, res) => {
    Mapping.create(req.body)
        .then(core => res.json(core))
});

app.post('/hello', (req, res) => {
    let query;

    let sender = req.body.sender_id;
    console.log("got ", sender);

    if (sender) {
        query = Mapping.findOne({
            where: {
                sender_id: sender
            }
        })
    }

    query.then(core => {
        let result = forwarderRequest(req.body, core.translator_id);
        return query.then(core => res.json(result))
    })
});

function forwarderRequest(body, translatorId) {
    const requestArgs = {
        uri: `https://${proxyHost}/forward-to/${translatorId}`,
        method: 'POST',
        json: body
    };

    return new Promise((resolve, reject) => {
        request(requestArgs, (error, response, data) => {
            if (error) {
                return reject(error);
            }

            return resolve(data);
        });
    });
}

app.listen(port, host, () => {
    console.log(`Running HelloDarwin http server on port ${port}`);
});

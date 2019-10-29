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

/**
 * incoming data is:
 * {
 *     "translator_id" : [translator_id],
 *     "sender_id": [sender_id]
 * }
 *
 * Sender ID is just some unique id from the sending service that identifies
 * the user/acct.
 *
 * Translator ID is the id for the HelloDarwin Translator
 *
 */
app.post('/hello/register', (req, res) => {
    Mapping.create(req.body)
        .then(core => res.json(core))
});

/**
 * The body is JSON that includes sender_id.
 *
 * Extract that ID and lookup the translator id.
 *
 * Then send to the Internet forwarder using that translator id and
 * the original body.
 */
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

/**
 *
 * @param body
 * @param translatorId
 * @returns {Promise<any>}
 */
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

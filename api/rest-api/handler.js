'use strict';

const api_url = "https://howmanydayssincemontaguestreetbridgehasbeenhit.com/"
module.exports.getApi = async (event, context, callback) => {
    // const https = require('https'); // or 'https' for https:// URLs
    var https = require('follow-redirects').https;

    return new Promise((resolve, reject) => {
        console.log(api_url + 'api')
        https.get(api_url + 'api?after=all', (res) => {
            var { statusCode } = res;
            var contentType = res.headers['content-type'];

            let error;

            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }

            if (error) {
                console.error(error.message);
                // console.error(res);
                // consume response data to free up memory
                res.resume();
            }

            res.on('data', (chunk) => {
                resolve(chunk);
            });

        }).on('error', (e) => {
            reject(`Got error: ${e.message}`);
        });

    });

};

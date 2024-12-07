require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
require('dotenv').config();

(async () => {
    try {
        const server = Hapi.server({
            port: 3000,
            host: '0.0.0.0',
            routes: {
                cors: {
                    origin: ['*'],
                },
            },
        });

        const model = await loadModel();
        server.app.model = model;

        server.route(routes);

        server.ext('onPreResponse', (request, h) => {
            const response = request.response;

            if (response instanceof InputError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message || 'Terjadi kesalahan dalam melakukan prediksi',
                });
                newResponse.code(response.statusCode || 400);
                return newResponse;
            }

            if (response.isBoom) {
                const statusCode = response.output.statusCode || 500;
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message || 'Payload content length greater than maximum allowed: 1000000',
                });
                newResponse.code(statusCode);
                return newResponse;
            }

            return h.continue;
        });

        await server.start();
        console.log(`Server started at: ${server.info.uri}`);
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();

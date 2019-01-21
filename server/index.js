import muster, { ref, variable, format, computed, match, param, types, fromPromise, toNode, ok } from '@dws/muster';
import { musterExpress, socketConnect } from '@dws/muster-server';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import _ from 'lodash';

// NOTE WS transport also fails with just the HTTP server (no express)

const accounts = {
    one: { id: 'one', name: 'One', active: true },
    two: { id: 'two', name: 'Two', active: true }
};

// Create simple muster graph
const musterApp = muster({
    name: variable('Jane'),
    greeting: format('Hello, ${name}!', {
        name: ref('name')
    }),
    alias: ref('greeting'),
    accounts: {
       [match(types.string, 'id')]: fromPromise({
           get: function({ id }) {
               return Promise.resolve(toNode(accounts[id]));
           },
           set: function({ id }, data) {
               if (accounts[id]) {
                   accounts[id] = _.extend({}, accounts[id], data);
               }
               return Promise.resolve(ok());
           }
       })
    }
});

// Create the express.js app
const app = express();

app.use(cors());

app.post('/muster', bodyParser.json(), musterExpress(musterApp, {
    enableRequestLogging: false
}));

// Explicitly create HTTP server
const httpServer = http.createServer(app);

// Create the WebSocket server based on the HTTP server
const webSocketServer = new WebSocket.Server({
    server: httpServer
});

// Add WS connection listener
webSocketServer.on('connection', (ws) => {
    // Hand over the web socket connection to socketConnect
    console.info('WebSocket connection established ...');
    socketConnect(musterApp, ws);
});

// Start the HTTP server
httpServer.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port ${httpServer.address().port}`);
});

import muster from '@dws/muster';
import {
    ref, query, entries, head, root,
    get, set, invalidate, invalidateOn, on, dispatch
} from '@dws/muster';

import { remote } from '@dws/muster-remote';

// NOTE HTTP works fine, as can be seen by setting useSockets: false

const useSockets = true;
const url = useSockets ? 'ws://0.0.0.0:8000/' : 'http://0.0.0.0:8000/muster';

const clientApp = muster({
    local: 'Local Value',
    api: remote(url, { useSockets })
});

clientApp.resolve(ref('local')).then(function(result) {
    console.log('Local: %s', result);
});

// Test issue https://github.com/dwstech/muster/issues/38

// 1. Resolve a remote ref

clientApp.resolve(ref('api', 'greeting')).then(function(result) {
    console.log('Greeting: %s', result);
});

// 2. When enabling the following, error: socket.js:174 WebSocket connection to 'ws://0.0.0.0:8000/' failed: WebSocket is closed before the connection is established.

clientApp.resolve(ref('api', 'alias')).then(function(result) {
    console.log('Greeting (alias): %s', result);
});

// 3. When this is enabled, error: socket.js:158 WebSocket is already in CLOSING or CLOSED state.

// clientApp.resolve(ref('api', 'greeting')).then(function(result) {
//     console.log('Greeting: %s', result);
// });

// 4. test issue https://github.com/dwstech/muster/issues/37

// NOTE on page reload, MusterError: Node does not support getChild operation is thrown

clientApp.resolve(query(ref('api', 'accounts', 'one'), {
    id: true, name: true, active: true
})).subscribe(function(result) {
    console.log('Account One:', result);
});

setTimeout(function() {
    clientApp.resolve(set(ref('api', 'name'), 'Julia')).then(function() {
        console.log('Updated graph: api.name');
    });
}, 1000);

setTimeout(function() {
    clientApp.resolve(set(ref('api', 'accounts', 'one'), {
        name: 'Changed'
    })).then(function() {
        console.log('Updated graph: api.accounts.one');
    });
}, 2000);

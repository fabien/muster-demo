import muster from '@dws/muster';
import {
    ref, query, entries, head, root, toNode,
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

clientApp.resolve(ref('api', 'greeting')).then(function(result) {
    console.log('Greeting: %s', result);
});

clientApp.resolve(ref('api', 'alias')).then(function(result) {
    console.log('Greeting (alias): %s', result);
});

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

// With the setTimeout above, the one below is not executing at all.
// Without it, it throws MusterError: Node does not support getChild operation

setTimeout(function() {
    clientApp.resolve(set('api', 'accounts', 'one', toNode({
        id: 'one', name: 'Changed ' + new Date(), active: true
    }))).then(function() {
        console.log('Updated graph: api.accounts.one');
    }).catch(function(err) {
        console.log(err);
    });
}, 2000);

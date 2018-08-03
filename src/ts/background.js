import jq from 'jq-web/jq.wasm.js';

// Build the connection to the frontend
chrome.runtime.onConnect.addListener(port => {
    // Check the connection
    if (port.name === 'jq-backend-connection') {
        // Listen to messages from frontend
        port.onMessage.addListener(msg => {
            // Filter the JSON with JQ
            jq.promised.raw(msg.json, msg.filter).then(result => {
              // Send the result from JQ to the frontend
              port.postMessage({jqResult: jqResult})
            }).catch(err => console.error(err));
        });
    }
});

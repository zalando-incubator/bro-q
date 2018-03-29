import jq from 'jq-web/jq.wasm.js';

function getJq(jsonInput, filter = '.') {
  return jq.raw(jsonInput, filter);
}

// Build the connection to the frontend
chrome.runtime.onConnect.addListener(port => {
  // Check the connection
  if (port.name == 'jq-backend-connection') {
    // Listen to messages from frontend
    port.onMessage.addListener(msg => {
      // Filter the JSON with JQ
      const jqResult = getJq(msg.json, msg.filter);
      // Send the result from JQ to the frontend
      port.postMessage({ jqResult: jqResult });
    });
  }
});

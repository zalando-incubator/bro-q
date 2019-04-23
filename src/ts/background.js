import jq from 'jq-web/jq.wasm.js';


function getJq(jsonInput, filter = '.') {
  return jq(JSON.parse(jsonInput), filter);
}


// Build the connection to the frontend
chrome.runtime.onConnect.addListener(port => {
  // Check the connection
  if (port.name === 'jq-backend-connection') {
    // Listen to messages from frontend
    port.onMessage.addListener(msg => {
      try {
          // Filter the JSON with JQ
          const jqResult = JSON.stringify(getJq(msg.json, msg.filter));
          // Send the result from JQ to the frontend
          port.postMessage({ jqResult: jqResult, error: null });
      } catch(err) {
          port.postMessage({ jqResult: null, error: err.message});
      }
    });
  }
});

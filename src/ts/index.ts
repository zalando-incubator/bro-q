import checkIfJson from './util/check-if-json';
import * as ui from './ui';
import * as $ from 'jquery';
import { checkStorageOptions } from './options';

let input = '';
let output = '';
let filter = '.';
let port = null;

function onLoad() {
  checkIfJson(function(pre) {
    pre.hidden = true;

    checkStorageOptions();
    loadExtension(pre);
  });
}

function loadExtension(pre) {
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      if (key == 'options') {
        loadExtension(pre);
      }
    }
  });
  chrome.storage.sync.get(['options'], function(result) {
    if (result.options != undefined) {
      ui.loadEditorDep();
      ui.renderCss();

      // Get JSON from html
      input = pre.textContent;

      ui.renderUi();
      ui.renderInputEditor(input);
      ui.renderOutputEditor(output);

      if (window.location.hash.includes('#broq-filter=')) {
        const filterInputField = document.getElementById('filter');
        filter = decodeURIComponent(window.location.hash);
        filter = filter.replace('#broq-filter=', '');
        filterInputField.setAttribute('value', filter);
      }

      // Build a connection to the backend
      port = chrome.runtime.connect({ name: 'jq-backend-connection' });
      // Send the Json and the JQ filter to the backend
      port.postMessage({ json: input, filter: filter });
      // Listen to Backend return
      port.onMessage.addListener(msg => {
        if (port.name == 'jq-backend-connection') {
          output = msg.jqResult;
          ui.updateOutput(output);
        }
      });
      checkFilter();
      $('#filter').bind('change paste keyup', checkFilter);
    }
  });
}

// get the filter input
function checkFilter() {
  filter = $('#filter')
    .val()
    .toString();
  port.postMessage({ json: input, filter: filter });
  filter = encodeURIComponent(filter);
  window.location.hash = 'broq-filter=' + filter;
}

document.addEventListener('DOMContentLoaded', onLoad, false);

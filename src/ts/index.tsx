import checkIfJson from './util/check-if-json';
import { checkStorageOptions } from './options';
import App from './App';
import { h, render } from "preact";

function onLoad() {
  checkIfJson((pre) => {
    pre.hidden = true;

    checkStorageOptions();
    loadExtension(pre);
  });
}

const loadInitialFilter = () => {
  if (window.location.hash.includes('#broq-filter=')) {
    return decodeURIComponent(window.location.hash).replace('#broq-filter=', '');
  } else {
    return '.';
  }
}

const getDocumentUrl = () => {
  return window.location.href.split('#')[0]
}

function loadExtension(pre) {
  chrome.storage.onChanged.addListener((changes) => {
    for (let key in changes) {
      if (key == 'options') {
        loadExtension(pre);
      }
    }
  });
  chrome.storage.sync.get(['options'], (result) => {
    if (result.options != undefined) {
      const broqContent = document.createElement('div');
      broqContent.id = 'broqContent';
      document.body.appendChild(broqContent);
      render(
        <App
          initialFilter={loadInitialFilter()}
          documentUrl={getDocumentUrl()}
          inputJson={pre.textContent}
          options={result.options}
          errors=""
        />,
        broqContent
      );
    }
  });
}

document.addEventListener('DOMContentLoaded', onLoad, false);

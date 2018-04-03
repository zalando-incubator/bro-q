let ace;
import { Clipboard } from 'ts-clipboard';
import * as $ from 'jquery';

export function loadEditorDep() {
  ace = require('brace');
  require('brace/mode/json');
  require('brace/theme/github');
  require('brace/ext/searchbox');

  // Themes
  require('brace/theme/github'); // Default
  require('brace/theme/monokai');
  require('brace/theme/ambiance');
  require('brace/theme/chaos');
  require('brace/theme/chrome');
  require('brace/theme/clouds');
  require('brace/theme/clouds_midnight');
  require('brace/theme/cobalt');
  require('brace/theme/crimson_editor');
  require('brace/theme/dawn');
  require('brace/theme/dracula');
  require('brace/theme/dreamweaver');
  require('brace/theme/eclipse');
  require('brace/theme/github');
  require('brace/theme/gob');
  require('brace/theme/gruvbox');
  require('brace/theme/idle_fingers');
  require('brace/theme/iplastic');
  require('brace/theme/katzenmilch');
  require('brace/theme/kr_theme');
  require('brace/theme/kuroir');
  require('brace/theme/merbivore');
  require('brace/theme/merbivore_soft');
  require('brace/theme/mono_industrial');
  require('brace/theme/pastel_on_dark');
  require('brace/theme/solarized_dark');
  require('brace/theme/solarized_light');
  require('brace/theme/sqlserver');
  require('brace/theme/terminal');
  require('brace/theme/textmate');
  require('brace/theme/tomorrow');
  require('brace/theme/tomorrow_night');
  require('brace/theme/tomorrow_night_blue');
  require('brace/theme/tomorrow_night_bright');
  require('brace/theme/tomorrow_night_eighties');
  require('brace/theme/twilight');
  require('brace/theme/vibrant_ink');
  require('brace/theme/xcode');
}

export function renderCss() {
  const styleURL = chrome.extension.getURL('/css/skeleton.css');
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = styleURL;
  document.head.appendChild(style);
}

export function updateOutput(output) {
  output = JSON.stringify(JSON.parse(output), null, 2);
  const editor = ace.edit('json-editor-output');
  editor.setValue(output);
  editor.clearSelection();
  editor.scrollToLine(0);
}

export function renderInputEditor(input) {
  chrome.storage.sync.get(['options'], function(result) {
    if (result.options != undefined) {
      const prettify = JSON.stringify(JSON.parse(input), null, 2);
      const editor = ace.edit('json-editor-input');
      let options = JSON.parse(result.options);
      editor.getSession().setMode('ace/mode/json');
      editor.$blockScrolling = Infinity;
      editor.setOptions(options);
      editor.setTheme(options.theme);
      editor.setValue(prettify);
      editor.clearSelection();
      editor.scrollToLine(0);
    }
  });
}

export function renderOutputEditor(output) {
  chrome.storage.sync.get(['options'], function(result) {
    if (result.options != undefined) {
      const editor = ace.edit('json-editor-output');
      let options = JSON.parse(result.options);
      editor.getSession().setMode('ace/mode/json');
      editor.$blockScrolling = Infinity;
      editor.setOptions(options);
      editor.setOption('useWorker', false);
      editor.setTheme(options.theme);
      editor.setValue(output);
      editor.clearSelection();
    }
  });
}

export function copyButton(div) {
  let copyButton = document.createElement('button');
  copyButton.id = 'copy-' + div;
  copyButton.innerHTML = 'Copy';
  copyButton.onclick = function() {
    const editor = ace.edit(div);
    Clipboard.copy(editor.getValue());
  };
  return copyButton;
}

export function renderUi() {
  if ($('#broqContent').length === 0) {
    let broqContent = document.createElement('div');
    broqContent.id = 'broqContent';

    let upperDiv = document.createElement('div');
    upperDiv.id = 'upperDiv';
    upperDiv.className = 'row';

    let leftSideDiv = document.createElement('div');
    leftSideDiv.id = 'leftSideDiv';
    leftSideDiv.className = 'one-half column';

    let filterDiv = document.createElement('div');
    filterDiv.id = 'filterDiv';

    let filterTitleDiv = document.createElement('div');
    filterTitleDiv.id = 'filterTitleDiv';

    let filterLabel = document.createElement('label');
    filterLabel.id = 'filterLabel';
    filterLabel.setAttribute('for', 'filter');
    filterLabel.innerHTML = './jq filter';

    let filter = document.createElement('input');
    filter.id = 'filter';
    filter.name = 'filter';
    filter.setAttribute('type', 'text');
    filter.setAttribute('value', '.');

    let linkToInfo = document.createElement('a');
    linkToInfo.id = 'linkToInfo';
    linkToInfo.href = 'https://stedolan.github.io/jq/manual/';
    linkToInfo.target = '_blank';

    const questionmarkURL = chrome.extension.getURL(
      '/pages/assets/questionmark.png'
    );
    let questionmark = document.createElement('img');
    questionmark.id = 'questionmark';
    questionmark.src = questionmarkURL;

    let curlButton = document.createElement('button');
    curlButton.id = 'curlButton';
    curlButton.innerHTML = 'copy for shell';
    curlButton.onclick = function() {
      //declare vars
      var url = window.location.href.split('#')[0];
      var filter = $('#filter')
        .val()
        .toString();

      //String: curl + <url> + | jq + '<filter>'
      var curl_string = 'curl ' + url + ' | jq ' + "'" + filter + "'";

      //copy to Clipboard
      Clipboard.copy(curl_string);
    };

    let logoDiv = document.createElement('div');
    logoDiv.id = 'logoDiv';
    logoDiv.className = 'one-half column';

    const logoURL = chrome.extension.getURL('/pages/assets/icon128.png');
    let logo = document.createElement('img');
    logo.id = 'logo';
    logo.src = logoURL;

    linkToInfo.appendChild(questionmark);

    filterTitleDiv.appendChild(filterLabel);
    filterTitleDiv.appendChild(linkToInfo);
    filterTitleDiv.appendChild(curlButton);

    filterDiv.appendChild(filterTitleDiv);
    filterDiv.appendChild(filter);

    logoDiv.appendChild(logo);
    leftSideDiv.appendChild(filterDiv);

    upperDiv.appendChild(leftSideDiv);
    upperDiv.appendChild(logoDiv);
    broqContent.appendChild(upperDiv);

    let editorDiv = document.createElement('div');
    editorDiv.className = 'row';
    editorDiv.id = 'editorDiv';

    let inputDiv = document.createElement('div');
    inputDiv.id = 'inputDiv';
    inputDiv.className = 'one-half column';

    let aceInputEditorDiv = document.createElement('div');
    aceInputEditorDiv.id = 'json-editor-input';

    let inputToolbar = document.createElement('div');
    inputToolbar.id = 'inputToolbar';

    let outputDiv = document.createElement('div');
    outputDiv.id = 'outputDiv';
    outputDiv.className = 'one-half column';

    let aceOutputEditorDiv = document.createElement('div');
    aceOutputEditorDiv.id = 'json-editor-output';

    let outputToolbar = document.createElement('div');
    outputToolbar.id = 'outputToolbar';

    inputToolbar.appendChild(copyButton('json-editor-input'));
    outputToolbar.appendChild(copyButton('json-editor-output'));

    inputDiv.appendChild(aceInputEditorDiv);
    inputDiv.appendChild(inputToolbar);
    outputDiv.appendChild(aceOutputEditorDiv);
    outputDiv.appendChild(outputToolbar);

    editorDiv.appendChild(inputDiv);
    editorDiv.appendChild(outputDiv);

    broqContent.appendChild(editorDiv);
    document.body.appendChild(broqContent);
  }
}

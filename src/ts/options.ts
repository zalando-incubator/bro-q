import * as $ from 'jquery';
import { saveStorage } from './storage';

const aceThemePath = 'ace/theme/';

const themes = {
  Default: aceThemePath + 'github',
  Monokai: aceThemePath + 'monokai',
  Ambiance: aceThemePath + 'ambiance',
  Chaos: aceThemePath + 'chaos',
  Chrome: aceThemePath + 'chrome',
  Clouds: aceThemePath + 'clouds',
  Clouds_midnight: aceThemePath + 'clouds_midnight',
  Cobalt: aceThemePath + 'cobalt',
  Crimson_editor: aceThemePath + 'crimson_editor',
  Dawn: aceThemePath + 'dawn',
  Dracula: aceThemePath + 'dracula',
  Dreamweaver: aceThemePath + 'dreamweaver',
  Eclipse: aceThemePath + 'eclipse',
  Github: aceThemePath + 'github',
  Gob: aceThemePath + 'gob',
  Gruvbox: aceThemePath + 'gruvbox',
  Idle_fingers: aceThemePath + 'idle_fingers',
  Iplastic: aceThemePath + 'iplastic',
  Katzenmilch: aceThemePath + 'katzenmilch',
  Kr_theme: aceThemePath + 'kr_theme',
  Kuroir: aceThemePath + 'kuroir',
  Merbivore: aceThemePath + 'merbivore',
  Merbivore_soft: aceThemePath + 'merbivore_soft',
  Mono_industrial: aceThemePath + 'mono_industrial',
  Pastel_on_dark: aceThemePath + 'pastel_on_dark',
  Solarized_dark: aceThemePath + 'solarized_dark',
  Solarized_light: aceThemePath + 'solarized_light',
  Sqlserver: aceThemePath + 'sqlserver',
  Terminal: aceThemePath + 'terminal',
  Textmate: aceThemePath + 'textmate',
  Tomorrow: aceThemePath + 'tomorrow',
  Tomorrow_night: aceThemePath + 'tomorrow_night',
  Tomorrow_night_blue: aceThemePath + 'tomorrow_night_blue',
  Tomorrow_night_bright: aceThemePath + 'tomorrow_night_bright',
  Tomorrow_night_eighties: aceThemePath + 'tomorrow_night_eighties',
  Twilight: aceThemePath + 'twilight',
  Vibrant_ink: aceThemePath + 'vibrant_ink',
  Xcode: aceThemePath + 'xcode'
};

const defaultEditorOptions = {
  highlightActiveLine: true,
  highlightSelectedWord: true,
  readOnly: true,
  autoScrollEditorIntoView: false,
  showLineNumbers: true,
  showGutter: true,
  displayIndentGuides: true,
  fixedWidthGutter: false,
  theme: themes.Default,
  fontSize: '14px',
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
  dragEnabled: true
};

const defaultCustomOptions = {
  liveUrlQuery: true,
  hideUnfilteredJsonByDefault: false,
};

export const defaultOptions = Object.assign({}, defaultEditorOptions, defaultCustomOptions);

export function checkStorageOptions() {
  chrome.storage.sync.get(['options'], function (result) {
    if (result.options === undefined) {
      saveStorage(JSON.stringify(defaultOptions));
    }
  });
}

$(function () {
  checkStorageOptions();
  getOptions();
});

export function parseOptions(options: string) {
  return Object.assign({}, defaultOptions, JSON.parse(options))
}

export function parseEditorOptions(options: string) {
  const parsedOptions = JSON.parse(options);
  return Object.keys(defaultEditorOptions).reduce((accum, key) => (
    Object.assign(accum, { [key]: parsedOptions[key] })
  ), { ...defaultEditorOptions });
}

function getOptions() {
  chrome.storage.onChanged.addListener(function (changes) {
    for (let key in changes) {
      if (key == 'options') {
        getOptions();
      }
    }
  });
  chrome.storage.sync.get(['options'], function (result) {
    if (result.options != undefined) {
      const options = parseOptions(result.options);
      $('#theme').val(
        Object.keys(themes).find(key => themes[key] === options.theme)
      );

      $('#font-size').val(options.fontSize.match(/\d/g).join(''));
      $('#font-family').val(options.fontFamily);

      Object.keys(options).forEach(key => {
        let value = options[key];
        if (typeof value === 'boolean') {
          $(`#${key}`).prop('checked', value);
        }
      });

      $('#save-btn').on("click", saveOptions);
      $('#default-btn').on("click", () => {
        saveStorage(JSON.stringify(defaultOptions));
      });
    }
  });
}

function saveOptions() {
  chrome.storage.sync.get(['options'], function (result) {
    let currentOptions = result.options;
    if (currentOptions === null) {
      currentOptions = defaultOptions;
    } else {
      currentOptions = parseOptions(currentOptions);
    }
    let options = JSON.parse(JSON.stringify(currentOptions));

    const themeInput = $('#theme option:selected').val();
    let fontSizeInput = $('#font-size').val();
    let fontFamilyInput = $('#font-family').val();

    options.theme = themes[themeInput.toString()];

    if (fontSizeInput != '') {
      options.fontSize = fontSizeInput + 'px';
    }

    if (fontFamilyInput != '') {
      options.fontFamily = fontFamilyInput;
    }

    Object.keys(options).forEach(key => {
      let value = options[key];
      if (typeof value === 'boolean') {
        options[key] = $(`#${key}`).is(':checked');
      }
    });

    if (JSON.stringify(currentOptions) != JSON.stringify(options)) {
      saveStorage(JSON.stringify(options));
    }
  });
}

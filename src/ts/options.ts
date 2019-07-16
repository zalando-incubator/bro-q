import { saveStorage, checkStorageOptions } from './storage';
import {
  defaultEditorOptions,
  defaultCustomOptions,
  themes
} from './editorConfig';

export const defaultOptions = Object.assign(
  {},
  defaultEditorOptions,
  defaultCustomOptions
);

export function parseOptions(options: string) {
  return Object.assign({}, defaultOptions, JSON.parse(options));
}

export function parseEditorOptions(options: string) {
  const parsedOptions = JSON.parse(options);
  return Object.keys(defaultEditorOptions).reduce(
    (accum, key) => Object.assign(accum, { [key]: parsedOptions[key] }),
    { ...defaultEditorOptions }
  );
}

function getOptions() {
  chrome.storage.onChanged.addListener(changes => {
    for (let key in changes) {
      if (key == 'options') {
        getOptions();
      }
    }
  });
  chrome.storage.sync.get(['options'], result => {
    if (result.options != undefined) {
      const options = parseOptions(result.options);

      (document.getElementById(
        'theme'
      ) as HTMLSelectElement).value = Object.keys(themes).find(
        key => themes[key] === options.theme
      );

      (document.getElementById(
        'font-size'
      ) as HTMLInputElement).value = options.fontSize.match(/\d/g).join('');
      (document.getElementById('font-family') as HTMLInputElement).value =
        options.fontFamily;

      Object.keys(options).forEach(key => {
        let value = options[key];
        if (typeof value === 'boolean') {
          (document.getElementById(
            `${key}`
          ) as HTMLInputElement).checked = value;
        }
      });

      (document.getElementById(
        'save-btn'
      ) as HTMLButtonElement).addEventListener('click', saveOptions);
      (document.getElementById(
        'default-btn'
      ) as HTMLButtonElement).addEventListener('click', () =>
        saveStorage(JSON.stringify(defaultOptions))
      );
    }
  });
}

function saveOptions() {
  chrome.storage.sync.get(['options'], result => {
    let currentOptions = result.options;
    if (currentOptions === null) {
      currentOptions = defaultOptions;
    } else {
      currentOptions = parseOptions(currentOptions);
    }
    let options = JSON.parse(JSON.stringify(currentOptions));

    const themeInput = (document.querySelector(
      '#theme option:checked'
    ) as HTMLSelectElement).value;
    let fontSizeInput = (document.getElementById(
      'font-size'
    ) as HTMLInputElement).value;
    let fontFamilyInput = (document.getElementById(
      'font-family'
    ) as HTMLInputElement).value;

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
        options[key] = (document.querySelector(
          `#${key}`
        ) as HTMLInputElement).checked;
      }
    });

    if (JSON.stringify(currentOptions) != JSON.stringify(options)) {
      saveStorage(JSON.stringify(options));
    }
  });
}

checkStorageOptions(defaultEditorOptions);
getOptions();

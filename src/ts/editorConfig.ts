export const aceThemePath = 'ace/theme/';

export const themes = {
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

export const defaultCustomOptions = {
  liveUrlQuery: true,
  hideUnfilteredJsonByDefault: false
};

export const defaultEditorOptions = {
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
  fontFamily:
    'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
  dragEnabled: true
};

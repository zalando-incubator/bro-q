import * as brace from 'brace'
import { h, Component } from 'preact';
require('brace/mode/json');
require('brace/theme/github');
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


const DEFAULT_THEME = 'brace/theme/github';

interface BraceProps {
  name: string,
  value: string
  onChange?: Function,
  options?: any
}

interface BraceState {

}

export default class BraceEditor extends Component<BraceProps, BraceState> {

  componentWillReceiveProps(nextProps) {
    const {
      name,
      value,
    } = nextProps;
    const editor = brace.edit(name);
    editor.setValue(value);
    editor.clearSelection();
    editor.scrollToLine(0, false, true, null);
    editor.resize(true);
  }

  componentDidMount() {
    const {
      name,
      options
    } = this.props;
    const editor = brace.edit(name);
    editor.getSession().setMode('ace/mode/json');
    editor.setTheme(options.theme || DEFAULT_THEME);
    editor.$blockScrolling = Infinity;
    editor.resize(true);
    editor.setShowPrintMargin(false);
    editor.setOptions({
      ...options
    });
  }

  render() {
    const {
      name,
    } = this.props;
    return (
      <div id={name}></div>
    );
  }

}

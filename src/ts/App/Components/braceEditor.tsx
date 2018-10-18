import * as brace from 'brace'
import { h, Component } from 'preact';
require('brace/mode/json');
require('brace/theme/github');

interface BraceProps {
  name: string,
  value: string
  onChange?: Function,
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
  }

  componentDidMount() {
    const {
      value,
      name
    } = this.props;
    const editor = brace.edit(name);
    editor.getSession().setMode('ace/mode/json');
    editor.setTheme('ace/theme/github');
    editor.$blockScrolling = Infinity;
    editor.setOptions({
      maxLines: Infinity
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

import { h, Component } from 'preact';
import BraceEditor from './Components/braceEditor';
import { Clipboard } from 'ts-clipboard';

export interface InputOutputProps {
  inputJson: string;
  outputJson: string;
  options: object;
}

export interface InputOutputState {
  hideUnfilteredJson: boolean;
}

const prettyJson = (json: string) => {
  return JSON.stringify(JSON.parse(json), null, 2);
}

export default class InputOutput extends Component<InputOutputProps, InputOutputState> {
  constructor(props) {
    super(props);

    this.state = {
      hideUnfilteredJson: props.options["hideUnfilteredJsonByDefault"] 
    };
  }

  render() {
    const { inputJson, outputJson, options } = this.props;
    const { hideUnfilteredJson } = this.state;
    const prettyInput = prettyJson(inputJson);
    const prettyOutput = prettyJson(outputJson);
    const prettyOptions = options;
    return (
      <div class="row" id="editorDiv">
        <div id="inputDiv" class={hideUnfilteredJson ? "hidden" : "one-half column"}>
          <BraceEditor
            name="json-editor-input"
            value={prettyInput}
            options={prettyOptions}
          />
          <div id="inputToolbar">
            <button id="copy-json-editor-input" onClick={() => Clipboard.copy(inputJson)}>Copy</button>
          </div>
        </div>
        <div id="outputDiv" class={hideUnfilteredJson ? null : "one-half column"}>
          <BraceEditor
            name="json-editor-output"
            value={prettyOutput}
            options={prettyOptions}
          />
          <div id="outputToolbar" class="button-group">
            <button id="copy-json-editor-output" onClick={() => Clipboard.copy(outputJson)}>Copy</button>
            <button id="outputDiv-fullscreen-button" onClick={() => this.setState({hideUnfilteredJson: !hideUnfilteredJson})}>{!!hideUnfilteredJson && "Show Unfiltered JSON" || "Hide Unfiltered JSON"}</button>
          </div>
        </div>
      </div>
    );
  }
}

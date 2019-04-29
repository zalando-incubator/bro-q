import { h, Component } from 'preact';
import BraceEditor from './Components/braceEditor';
import { Clipboard } from 'ts-clipboard';

export interface InputOutputProps {
  inputJson: string;
  outputJson: string;
  options: string;
}

const prettyJson = (json: string) => {
  return JSON.stringify(JSON.parse(json), null, 2);
}

export default class InputOutput extends Component<InputOutputProps> {
  render() {
    const { inputJson, outputJson, options } = this.props;
    const prettyInput = prettyJson(inputJson);
    const prettyOutput = prettyJson(outputJson);
    const prettyOptions = JSON.parse(options);
    return (
      <div class="row" id="editorDiv">
        <div id="inputDiv" class="one-half column">
          <BraceEditor
            name="json-editor-input"
            value={prettyInput}
            options={prettyOptions}
          />
          <div id="inputToolbar">
            <button id="copy-json-editor-input" onClick={() => Clipboard.copy(inputJson)}>Copy</button>
          </div>
        </div>
        <div id="outputDiv" class="one-half column">
          <BraceEditor
            name="json-editor-output"
            value={prettyOutput}
            options={prettyOptions}
          />
          <div id="outputToolbar">
            <button id="copy-json-editor-output" onClick={() => Clipboard.copy(outputJson)}>Copy</button>
          </div>
        </div>
      </div>
    );
  }
}

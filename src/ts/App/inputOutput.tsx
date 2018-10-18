import { h, Component } from 'preact';
import BraceEditor from './Components/braceEditor';
import { Clipboard } from 'ts-clipboard';

export interface InputOutputProps {
  inputJson: string;
  outputJson: string;
}

const prettyJson = (json: string) => {
  return JSON.stringify(JSON.parse(json), null, 2);
}

export default class InputOutput extends Component<InputOutputProps> {
  render() {
    const { inputJson, outputJson } = this.props;
    const prettyInput = prettyJson(inputJson);
    const prettyOutput = prettyJson(outputJson);
    return (
      <div class="row" id="editorDiv">
        <div id="inputDiv" class="one-half column">
          <BraceEditor
            name="json-editor-input"
            value={prettyInput}
          />
          <div id="inputToolbar">
            <button onClick={() => Clipboard.copy(inputJson)}>Copy</button>
          </div>
        </div>
        <div id="outputDiv" class="one-half column">
          <BraceEditor
            name="json-editor-output"
            value={prettyOutput}
          />
          <div id="outputToolbar">
            <button onClick={() => Clipboard.copy(outputJson)}>Copy</button>
          </div>
        </div>
      </div>
    );
  }
}

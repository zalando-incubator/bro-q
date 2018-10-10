import { h, Component } from 'preact';
import AceEditor from './Components/aceEditor';
import Button from './Components/button';
import { Clipboard } from 'ts-clipboard';

export interface InputOutputProps {
  inputJson: string;
  outputJson: string;
  updateInput: (newInput:string)=>void;
}

const prettyJson = (json: string) => {
  return JSON.stringify(JSON.parse(json), null, 2);
}

export default class InputOutput extends Component<InputOutputProps> {
  render() {
    const { inputJson, outputJson, updateInput } = this.props;
    const prettyInput = prettyJson(inputJson);
    const prettyOutput = prettyJson(outputJson);
    const aceOptions = {
      highlightActiveLine: true,
      highlightSelectedWord: true,
      readOnly: true,
      autoScrollEditorIntoView: false,
      showLineNumbers: true,
      showGutter: true,
      displayIndentGuides: true,
      fixedWidthGutter: false,
      theme: 'ace/theme/github',
      fontSize: '14px',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
      dragEnabled: true,
      useWrapMode: true
    };
    return (
      <div class="row" id="editorDiv">
        <div id="inputDiv" class="one-half column">
          <AceEditor
            name="json-editor-input"
            mode="json"
            onChange={updateInput}
            editorProps={{$blockScrolling: true}}
            setOptions={aceOptions}
            theme="github"
            value={prettyInput}
            readOnly={true}
            tabSize={2}
            showGutter={true}
            
          />
          <div id="inputToolbar">
            <Button
              label="Copy"
              onClick={()=>Clipboard.copy(inputJson)}
            />
          </div>
        </div>
        <div id="outputDiv" class="one-half column">
          <AceEditor
            name="json-editor-output"
            mode="json"
            editorProps={{$blockScrolling: true}}
            setOptions={aceOptions}
            theme="github"
            value={prettyOutput}
            readOnly={true}
            tabSize={2}
            showGutter={true}
          />
          <div id="outputToolbar">
            <Button
              label="Copy"
              onClick={()=>Clipboard.copy(outputJson)}
            />
          </div>
        </div>
      </div>
    );
  }
}
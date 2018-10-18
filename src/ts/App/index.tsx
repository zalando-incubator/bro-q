import { h, Component } from 'preact';
import FilterHeaderBar from './filterHeaderBar'
import FilterBar from './filterBar'
import InputOutput from './inputOutput'
export interface AppProps {
  initialFilter: string;
  documentUrl: string;
  inputJson: string;
  options: object;
}
interface AppState {
  filter: string;
  outputJson: string;
  inputJson: string;
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      filter: props.initialFilter,
      outputJson: props.inputJson,
      inputJson: props.inputJson,
    };
  }

  port: chrome.runtime.Port;

  componentDidMount() {
    this.port = chrome.runtime.connect({ name: 'jq-backend-connection' });
    this.port.onMessage.addListener(msg => {
      this.setState({
        outputJson: msg.jqResult
      });
    });
    this.runJqFilter();
  }

  componentWillUnmount() {
    this.port.disconnect();
  }

  updateFilter = (newFilter: string) => {
    this.setState({
      filter: newFilter
    }, this.runJqFilter);

    if (newFilter !== '.' && newFilter !== '') {
      window.location.hash = `broq-filter=${encodeURIComponent(newFilter)}`;
    } else {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  runJqFilter = () => {
    const { inputJson, filter } = this.state;
    this.port.postMessage({ json: inputJson, filter: filter });
  }

  render() {
    const { inputJson, outputJson, filter } = this.state;
    const { documentUrl } = this.props;
    return <div>
      <link
        href={chrome.extension.getURL('/css/skeleton.css')}
        type="text/css"
        rel="stylesheet"
      />
      <div id="upperDiv" class="flex-row">
        <div id="leftSideDiv" class="flex-column">
          <FilterHeaderBar filter={filter} documentUrl={documentUrl} updateFilter={this.updateFilter} />
          <FilterBar filter={filter} updateFilter={this.updateFilter} />
        </div>
      </div>
      <InputOutput
        inputJson={inputJson}
        outputJson={outputJson}
      />
    </div>;
  }
}

import { h, Component } from 'preact';
import FilterHeaderBar from './filterHeaderBar';
import FilterBar from './filterBar';
import Errors from './errors';
import InputOutput from './inputOutput';
import LoadingBar from './loadingBar';

export interface AppProps {
  initialFilter: string;
  documentUrl: string;
  inputJson: string;
  options: string;
  errors: string;
}

interface AppState {
  filter: string;
  outputJson: string;
  inputJson: string;
  errors: string;
  options: Object;
  loading: boolean;
  filterStatus: string;
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      filter: props.initialFilter,
      outputJson: props.inputJson,
      errors: props.errors,
      inputJson: props.inputJson,
      options: JSON.parse(props.options),
      loading: false,
      filterStatus: "clear",
    };
  }

  port: chrome.runtime.Port;

  componentDidMount() {
    this.port = chrome.runtime.connect({ name: 'jq-backend-connection' });
    this.port.onMessage.addListener(msg => {
      this.setState({
        outputJson: msg.jqResult,
        errors: msg.error,
        loading: false,
        filterStatus: msg.error ? "errored" : "clear"
      });
    });
    this.runJqFilter();
  }

  componentWillUnmount() {
    this.port.disconnect();
  }

  pushHistoryStateWithoutBroQ = () => {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  updateFilter = (newFilter: string) => {
    this.setState({
      filter: newFilter
    }, this.runJqFilter);

    if (this.state.options["liveUrlQuery"]) {
      if (newFilter !== '.' && newFilter !== '') {
          window.location.hash = 'broq-filter=' + newFilter;
      } else if (window.location.hash.includes('#broq-filter=')) {
          this.pushHistoryStateWithoutBroQ();
      }
    } else {
      if (window.location.hash && window.location.hash !== `#broq-filter=${newFilter}`) {
          this.pushHistoryStateWithoutBroQ();
      }
    }
  }

  runJqFilter = () => {
    const { inputJson, filter } = this.state;
    this.setState({loading: true, errors: "", filterStatus: "executed"});
    this.port.postMessage({ json: inputJson, filter: filter });
  }

  render() {
    const { inputJson, outputJson, errors, filter, filterStatus, options, loading } = this.state;
    const { documentUrl } = this.props;
    return <div>
      {!!this.state.loading && <LoadingBar /> }
      <link
        href={chrome.extension.getURL('/css/skeleton.css')}
        type="text/css"
        rel="stylesheet"
      />
      <div id="upperDiv" class="flex-row">
        <div id="leftSideDiv" class="flex-column">
          <FilterHeaderBar filter={filter} documentUrl={documentUrl} updateFilter={this.updateFilter} />
          <div class="row">
            <FilterBar filter={filter} updateFilter={this.updateFilter} filterStatus={filterStatus} />
            <Errors errors={errors} />
          </div>
        </div>
        <div id="logoDiv">
            <img id="logo" src={chrome.extension.getURL('/pages/assets/icon128.png')} />
        </div>
      </div>
      <InputOutput
        inputJson={inputJson}
        outputJson={outputJson}
        options={options}
      />
    </div>;
  }
}

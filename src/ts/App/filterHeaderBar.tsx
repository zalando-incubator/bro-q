import { h, Component } from 'preact';
import { Clipboard } from 'ts-clipboard';
import FilterPicker from './filterPicker';
import { addFilter } from '../storage'

export interface FilterHeaderBarProps {
  filter: string;
  documentUrl: string;
  updateFilter: (newFilter: string) => void;
}

interface FilterHeaderBarState {
  filterPickerOpen: boolean;
}

export default class FilterHeaderBar extends Component<FilterHeaderBarProps, FilterHeaderBarState> {
  state = {
    filterPickerOpen: false
  };

  copyShellCommand = () => {
    const { documentUrl, filter } = this.props;
    const curlString = `curl ${documentUrl} | jq '${filter}'`;
    Clipboard.copy(curlString);
  }

  copySharableURL = () => {
    const { documentUrl, filter } = this.props;
    const url = documentUrl.split('#')[0];
    const encodedFilter = encodeURIComponent(filter)
    Clipboard.copy(`${url}#broq-filter=${encodedFilter}`);
  }

  saveFilter = () => {
    addFilter(this.props.filter);
  }

  openFilterPicker = () => {
    this.setState({
      filterPickerOpen: true
    });
  }

  closeFilterPicker = (newFilter?: string) => {
    this.setState({
      filterPickerOpen: false
    });
    if (newFilter) {
      this.props.updateFilter(newFilter);
    }
  }

  render(props: FilterHeaderBarProps, state: FilterHeaderBarState) {

    return <div>
      <div id="filterTitleDiv">
        <label id="filterLabel" for="filter">./jq filter</label>
        <a id="linkToInfo" href="https://stedolan.github.io/jq/manual/" target="_blank">
          <img id="questionmark" src={chrome.extension.getURL('/pages/assets/questionmark.png')} />
        </a>
        <div class="button-group">
          <button label="copy for shell" onClick={this.copyShellCommand}>copy for shell</button>
          <button label="copy sharable url" onClick={this.copySharableURL}>copy sharable url</button>
        </div>
        <div class="button-group">
          <button onClick={this.saveFilter}>Save Filter</button>
          <button onClick={this.openFilterPicker}>Load Filter</button>
        </div>
      </div>
      {!!state.filterPickerOpen && <FilterPicker close={this.closeFilterPicker} />}
    </div>;
  }
}
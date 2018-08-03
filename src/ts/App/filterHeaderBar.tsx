import { h, Component } from 'preact';
import { Clipboard } from 'ts-clipboard';
import Button from './Components/button';
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
    if(newFilter) {
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
        <Button id="curlButton" label="copy for shell" onClick={this.copyShellCommand}/>
        <div class="button-group">
          <Button label="Save Filter" onClick={this.saveFilter} />
          <Button label="Load Filter" onClick={this.openFilterPicker} />
        </div>
      </div>
      {!!state.filterPickerOpen && <FilterPicker close={this.closeFilterPicker}/>}
    </div>;
  }
}
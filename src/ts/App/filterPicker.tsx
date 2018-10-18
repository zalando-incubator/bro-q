import { h, Component } from 'preact';
import { removeFilter, getFilters } from '../storage'
import Modal from './Components/modal';

export interface FilterPickerProps {
  close: (filter?: string) => void;
}

interface FilterPickerState {
  filters?: string[];
}

export default class FilterPicker extends Component<FilterPickerProps, FilterPickerState> {

  deleteFilter = (filter: string) => {
    removeFilter(filter, () => this.loadFilters())
  }

  componentDidMount() {
    this.loadFilters();
  }

  loadFilters() {
    getFilters((filters) => {
      this.setState({
        filters: filters
      });
    })
  }

  render(props: FilterPickerProps, { filters }: FilterPickerState) {
    if (filters === undefined) {
      return; //waiting for filters to load
    } else if (filters.length === 0) {
      alert('You don\'t have any saved filters yet.');
      return;
    } else {
      return <Modal close={() => props.close()}>
        {filters.map(filter => (
          <div class='saved-filter-wrapper'>
            <pre class='saved-filter' onClick={() => props.close(filter)}>{filter}</pre>
            <a href='#' class='remove-filter' title='Delete' onClick={() => this.deleteFilter(filter)}>X</a>
          </div>
        ))}
      </Modal>;
    }
  }
}
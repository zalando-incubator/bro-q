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
    var confirmDelete = confirm("Are you sure you want to delete the following filter?\n\t" + filter);
    if(confirmDelete == true) {
      removeFilter(filter, () => this.loadFilters())
    }
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
      return; // waiting for filters to load
    } else if (filters.length === 0) {
      alert('You don\'t have any saved filters.');
      props.close(); // close out the modal if its showing
      return;
    } else {
      return <Modal close={() => props.close()}>
        {filters.map(filter => (
          <div class='saved-filter-wrapper'>
            <pre class='saved-filter' onClick={() => props.close(filter)}>{filter}</pre>
            <button label='Delete' onClick={() => {
                this.deleteFilter(filter);
                // if there was only one filter left (that has now been deleted),
                // make sure to close the modal
                if(filters.length === 1) { 
                  props.close()
                }
              }
            }>X</button>
          </div>
        ))}
      </Modal>;
    }
  }
}
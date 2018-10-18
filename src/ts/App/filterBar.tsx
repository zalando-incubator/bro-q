import { h, Component } from 'preact';

export interface FilterBarProps {
  filter: string;
  updateFilter: (newFilter: string) => void;
}

interface FilterBarState {
  value: string;
  lastValue: string;
}

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default class FilterBar extends Component<FilterBarProps, FilterBarState> {
  timer: number;
  constructor(props) {
    super(props);

    this.state = {
      value: props.filter,
      lastValue: ''
    };
  }

  componentWillMount() {
    this.timer = null;
  }

  componentWillReceiveProps(newProps: FilterBarProps) {
    this.setState({
      value: newProps.filter
    });
  }

  handleChange = (event: Event) => {
    window.clearTimeout(this.timer);

    this.setState({
      value: (event.target as HTMLInputElement).value
    });

    this.timer = window.setTimeout(this.triggerChange, WAIT_INTERVAL);
  }

  handleKeyDown = (e) => {
    this.handleChange(e);
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange();
    }
  }

  triggerChange = () => {
    const { value, lastValue } = this.state;
    if (value !== lastValue) {
      this.props.updateFilter(value);
      this.setState({
        lastValue: value
      });
    }
  }

  render() {
    const { value } = this.state;

    return (
      <input
        onKeyUp={this.handleKeyDown}
        id="filter"
        name="filter"
        type="text"
        value={value}
      />
    );
  }
}
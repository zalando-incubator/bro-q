import { h, Component } from 'preact';

export interface ErrorsProps {
  errors: string;
}

export default class Errors extends Component<ErrorsProps> {

  render() {
    const { errors } = this.props;

    return (
      <div
        id="errors"
        name="errors"
      >{errors}</div>
    );
  }
}

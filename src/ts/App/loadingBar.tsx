import { h, Component, render } from 'preact';

export default class LoadingBar extends Component {

    render(){
        return (
            <div>
                <span class="loading-bar" style="width: 95%;"></span>
            </div>
        )
    }
}
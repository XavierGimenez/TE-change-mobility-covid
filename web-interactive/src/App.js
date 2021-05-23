import { React, Component } from 'react';
import './App.css';
import MobilityChangesWeeks from './ui/MobilityChangesWeeks';
import { Fragment } from 'react';
import { Provider } from './context/Provider';
import { Context } from './context/Context';

import * as d3 from 'd3';

class App extends Component {


    constructor(props) {
        super(props);
        this.state = {};
    }



    async componentDidMount() {

        // load data
        this.setState({
            data: await d3.csv('data/ES_reproductionrate_vs_mobility.csv')
        })
    }



    render() {
        let { data } = this.state;
        return (
            <Fragment>
            {
                data && <Provider data = {data}>
                    <Context.Consumer>
                        {
                            context => <Fragment>
                                <MobilityChangesWeeks {...context}/>
                            </Fragment>
                        }
                    </Context.Consumer>
                </Provider>
            }
            </Fragment>            
        );
    }    
}

export default App;

import { React, Component } from 'react';
import './App.css';
import MobilityChangesWeeks from './ui/MobilityChangesWeeks';
import MobilityVsReproductionRate from './ui/MobilityVsReproductionRate';
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
            data: await d3.csv(
                'data/ES_reproductionrate_vs_mobility.csv',
                d => {
                    d.mobility_change_from_baseline = +d.mobility_change_from_baseline;
                    d.mobility_change_from_baseline_week_rolling_avg = +d.mobility_change_from_baseline_week_rolling_avg;
                    d.reproduction_rate = +d.reproduction_rate;
                    d.reproduction_rate_week_rolling_avg = +d.reproduction_rate_week_rolling_avg;
                    return d;
                }
            )
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
                                <MobilityVsReproductionRate {...context}/>
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
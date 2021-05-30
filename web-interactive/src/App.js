import { React, Component } from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';
import './App.css';

import MobilityChangesWeeks from './ui/MobilityChangesWeeks';
import { Fragment } from 'react';
import { Provider } from './context/Provider';
import { Context } from './context/Context';
import MobilityVsReproductionRateScroller from './ui/MobilityVsReproductionRateScroller';
import MobilityCiclePlotWeekday from './ui/MobilityCyclePlotWeekday';
import { MOBILITY_CATEGORIES_INDEXES } from './common/constants';
import MobilityVsReproductionRateGrid from './ui/MobilityVsReproductionRateGrid';
import {
    COUNTRIES,
    COUNTRY_LABELS
} from './common/constants';



class App extends Component {



    constructor(props) {
        super(props);        
        this.state = {};
    }



    async componentDidMount() {

        // load data
        let promises = COUNTRIES.map( 
            async country => await d3.csv(
                'data/' + country + '_reproductionrate_vs_mobility.csv',
                d => {
                    d.metric = _.get(MOBILITY_CATEGORIES_INDEXES, d.metric);
                    d.mobility_change_from_baseline = +d.mobility_change_from_baseline;
                    d.reproduction_rate = +d.reproduction_rate;
                    d.weekDay = (new Date(d.date)).getDay();
                    return d;
                }
            )
        );
        
        let data = await Promise.all(promises);
        this.setState({
            data: _.zipObject(COUNTRIES, data)
        });

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
                                <MobilityCiclePlotWeekday {...context}/>
                                <hr className="ghost"/>
                                <MobilityVsReproductionRateScroller {...context}/>
                                <MobilityVsReproductionRateGrid {...context}/>
                            {/*    <MobilityChangesWeeks {...context}/>
                            */}
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
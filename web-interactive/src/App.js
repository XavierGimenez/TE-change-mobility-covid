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
    COUNTRIES
} from './common/constants';
import { Col, Container, Row } from 'react-bootstrap';



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
                                <div className="background-colored">
                                    <section className="footer" style={{margin:0}}>
                                    <Container>
                                        <Row>
                                            <Col xs={7}>                                        
                                                <h1 className="main">Restriccions in mobility and COVID-19 transmission</h1>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p>
                                                    In response to the COVID-19 pandemic, countries have sought to control SARS-CoV-2 transmission by restricting population movement through social distancing interventions, thus reducing the number of contacts. Hence, implementing strict social distancing policies is likely the most effective measure to suppress transmission.<br/>                                                
                                                </p>
                                                <p>
                                                    Google COVID-19 Community Mobility Reports and its mobility data represent an important proxy measure of social distancing, and many websites also offer research and statistics on the coronavirus pandemic. Here, we characterize the relationship between transmission and mobility for some countries around the world.
                                                </p>
                                            </Col>
                                        </Row>
                                    </Container>                            
                                    </section>
                                </div>
                                <MobilityCiclePlotWeekday {...context}/>
                                <MobilityChangesWeeks {...context}/>                                
                                <MobilityVsReproductionRateScroller {...context}/>
                                <MobilityVsReproductionRateGrid {...context}/>                                
                                <div className="background-colored">
                                    <section className="footer">
                                        <Container fluid>
                                            <Row>
                                                <Col style={{color:"#bbd4ce"}}>
                                                    <h3>BACKGROUND</h3>
                                                    <p>
                                                        Is the lockdown an effective measure to control the COVID-19 outbreak? This website explores the patterns between changes in population mobility due to COVID-19 policies and the effect on the spread of the virus and its reproduction rate.
                                                    </p>
                                                </Col>
                                                <Col xs={1}/>                                                
                                                <Col>
                                                    <h3>DATA</h3>
                                                    <p>
                                                        This site presents <a href="https://www.google.com/covid19/mobility/" target="_blank" rel="noreferrer">Google COVID-19 Community Mobility Reports</a> data on a set of countries of interest, as well as data related to the coronavirus pandemic from <a href="https://ourworldindata.org/coronavirus" target="_blank" rel="noreferrer">Our World in Data website.</a>
                                                    </p>
                                                </Col>
                                                <Col>
                                                    <h3>REFERENCES</h3>
                                                    <small>
                                                        <ul>
                                                            <li><a href="https://www.google.com/covid19/mobility" target="_blank" rel="noreferrer">Google COVID-19 Community Mobility Reports</a></li>
                                                            <li><a href="https://ourworldindata.org/coronavirus" target="_blank" rel="noreferrer">Coronavirus Pandemic - Our World in Data</a></li>
                                                            <li><a href="https://www.bloomberg.com/news/articles/2020-11-24/inside-bloomberg-s-covid-resilience-ranking" target="_blank" rel="noreferrer">Bloomberg’s Covid Resilience Ranking</a></li>
                                                            <li><a href="https://www.nature.com/articles/s41467-021-21358-2" target="_blank" rel="noreferrer">Nature article: Reduction in mobility and COVID-19 transmission</a></li>
                                                        </ul>
                                                    </small>                                                    
                                                </Col>
                                            </Row>
                                        </Container>
                                    </section>                                    
                                </div>                                
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
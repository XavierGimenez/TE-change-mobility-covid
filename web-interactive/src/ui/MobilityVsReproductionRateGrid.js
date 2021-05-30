import React, { Component } from 'react';
import { Fragment } from 'react';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import * as _ from 'lodash';
import * as d3 from 'd3';

import { 
    MOBILITY_CATEGORIES_INDEXES,
    MOBILITY_CATEGORIES
} from '../common/constants';
import MobilityVsReproductionCountry from './MobilityVsReproductionCountry'

import {
    COUNTRIES,
    COUNTRY_LABELS
} from '../common/constants';


class MobilityVsReproductionRateGrid extends Component {



    constructor(props) {
        super(props);
        this.defaultMobilityCategory = _.keys(MOBILITY_CATEGORIES)[3];
        this.state = {
            mobilityCategory: this.defaultMobilityCategory
        };
    }



    render() {
        let { data } = this.props;

        
        return <Container>
            <hr className="ghost"/>
            <Row>
                <Col>
                    <p>
                        All the countries are fighting the same coronavirus, but over a year into the pandemic, how each country has faced the outbreak and how effectively has been control of the pathogen’s spread look vastly different across the world.
                    </p>
                    <p>
                        Many factors can be taken into account when looking at the relationship between changes in the mobility and the reproduction rate of the virus: fatality rates, universal healthcare coverage, nation's GDP, well-being of the population, and other many indicators can be helpful to assess the success at containing the virus, although can be methodologicallly challenging when trying to associate them  with the mobility changes and its effect on the reproduction rate.
                    </p>
                </Col>
                <Col>                    
                    <p>
                        One way to account for these methodological problems is to look at the <a href="https://www.bloomberg.com/news/articles/2020-11-24/inside-bloomberg-s-covid-resilience-ranking" target="_blank">Bloomberg’s Covid Resilience Ranking</a>, which covers a wide number of datasets, indicators and indexes produced by organizations around the globe.                        
                    </p>
                    <p>
                        Below are a set of charts, showing the correlation between changes in mobility and reproduction rate for several countries, being all the countries sorted by its position in the Bloomberg’s Covid Resilience Ranking.
                    </p>
                    <div><small>Select a place category:</small></div>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                            {MOBILITY_CATEGORIES[this.state.mobilityCategory]}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {
                                _.toPairs(MOBILITY_CATEGORIES).map( pair => <Dropdown.Item 
                                    onClick={() => this.setState({mobilityCategory:pair[0]})} 
                                    key={pair[0]}>
                                        {pair[1]}
                                    </Dropdown.Item> )
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <hr className="ghost"/>
                               

                {   data && _.chunk(_.toPairs(data), 3).map( (chunk,i) => <Row key={i}>
                        {
                            chunk.map( (country, j) => <Col key={j}>
                                <Fragment>
                                    <h6 className="text-center">{COUNTRY_LABELS[_.indexOf(COUNTRIES, country[0])]}</h6>
                                    <MobilityVsReproductionCountry data={_.filter(country[1], o => o.metric === this.state.mobilityCategory)}/>
                                </Fragment>                            
                            </Col>)
                        }
                    </Row>)
                }
        </Container>
    }
}
export default MobilityVsReproductionRateGrid
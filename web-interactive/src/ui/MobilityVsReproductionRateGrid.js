import React, { Component } from 'react';
import { Fragment } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import * as _ from 'lodash';
import * as d3 from 'd3';

import { MOBILITY_CATEGORIES_INDEXES } from '../common/constants';
import MobilityVsReproductionCountry from './MobilityVsReproductionCountry'


class MobilityVsReproductionRateGrid extends Component {



    constructor(props) {
        super(props);
        this.state = {};
    }



    async componentDidMount() {
        let countries = ['DE', 'GB', 'IL', 'NZ','US'];
        let promises = countries.map( 
            async country => await d3.csv(
                'data/' + country + '_reproductionrate_vs_mobility.csv',
                d => {
                    d.metric = _.get(MOBILITY_CATEGORIES_INDEXES, d.metric);
                    d.mobility_change_from_baseline = +d.mobility_change_from_baseline;
                    d.reproduction_rate = +d.reproduction_rate;
                    return d;
                }
            )
        );
        
        let data = await Promise.all(promises);
        this.setState({
            data: _.zipObject(countries, data)
        });

    }


    render() {
        let { data } = this.state;

        return <Container>
                <h1>Mobility Vs Reproduction</h1>
               
                {   data && _.chunk(_.toPairs(data), 3).map( (chunk,i) => <Row key={i}>
                        {
                            chunk.map( (country, j) => <Col key={j}>
                                <Fragment>
                                    <h6>{country[0]}</h6>
                                    <MobilityVsReproductionCountry data={country[1]}/>
                                </Fragment>                            
                            </Col>)
                        }
                    </Row>)
                }
        </Container>
    }
}
export default MobilityVsReproductionRateGrid
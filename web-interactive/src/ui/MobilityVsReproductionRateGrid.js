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


class MobilityVsReproductionRateGrid extends Component {



    constructor(props) {
        super(props);
        this.defaultMobilityCategory = _.keys(MOBILITY_CATEGORIES)[3];
        this.state = {
            mobilityCategory: this.defaultMobilityCategory
        };
        this.countries = [  
            // top better
            "NZ", "SG", "AU", "IL", "KR", "FI",
            // top worst 
            "PE", "IN", "BR", "CO", "AR", "MX",

            "DE", "ES", "BE", "FR", "GB", "IT", "PT", "US", "DK"];
    }



    async componentDidMount() {
        let promises = this.countries.map( 
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
            data: _.zipObject(this.countries, data)
        });

    }


    render() {
        let { data } = this.state;

        
        
        let countryLabels = [
            "New Zealand", "Singapore", "Australia", "Israel", "South Korea", "Finland",
            "Peru", "India", "Brazil", "Colombia", "Argentina", "Mexico",
            "Germany", "Spain", "Belgium", "France", "United Kingdom", "Italy", "Portugal", "United States", "Denmark"
        ];

        return <Container>
                <h1>Mobility Vs Reproduction</h1>
               
                <Dropdown>
                    <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                        Select a mobility category
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

                {   data && _.chunk(_.toPairs(data), 3).map( (chunk,i) => <Row key={i}>
                        {
                            chunk.map( (country, j) => <Col key={j}>
                                <Fragment>
                                    { /*console.log(countryLabels[_.indexOf(this.countries, country[0])]) */}
                                    { /*console.log(_.filter(country[1], o => o.metric === this.state.mobilityCategory)) */}
                                    <h6 className="text-center">{countryLabels[_.indexOf(this.countries, country[0])]}</h6>
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
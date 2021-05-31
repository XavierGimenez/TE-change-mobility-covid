import React, { Component, Fragment } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import * as _ from 'lodash';
import MobilityChangesWeeksChart from './MobilityChangesWeeksChart';

import { 
    MOBILITY_CATEGORIES,
    COUNTRY_LABELS, 
    COUNTRIES
} from '../common/constants'; 

class MobilityChangesWeeks extends Component {



    constructor(props) {
        super(props);
        this.state = {
            country: 'ES'
        };
    }




    render() {
        let { data } = this.props,
            { country } = this.state,
            countryData;

        if(data)
            countryData = _.get(data, country);
        
        return <Container fluid>
            <section className="text-center">                
                <Row className="justify-content-center">
                    <Col xs={4}>
                        <p>
                            When looking at mobility trends considering weekly time spans and in comparison to 2020, this <span className="highlight year2021">year 2021</span> is reaching mobility levels close to the baseline.
                        </p>
                        <p>
                            While these is true for most of the top economies (see <span className="link" onClick={() => this.setState({country:'NZ'})}>New Zealand</span>), there are still some countries like <span className="link" onClick={() => this.setState({country:'MX'})}>Mexico</span>, struggling at recovering normality levels of mobility.
                        </p>                        
                        <div><small>Select country:</small></div>
                            <DropdownButton 
                                id="dropdown-item-button" 
                                variant="outline-info"
                                size="sm"
                                title={COUNTRY_LABELS[_.indexOf(COUNTRIES, this.state.country)]}>
                                {
                                    _.sortBy(COUNTRY_LABELS).map( c => <Dropdown.Item key={c} onClick={() => this.setState({country: COUNTRIES[_.indexOf(COUNTRY_LABELS, c)]})}>
                                            { c }
                                        </Dropdown.Item>
                                    )
                                }
                            </DropdownButton>
                    </Col>
                    <Col xs={7}>
                        <div className="chart-title">Trends in mobilty change (%), by week and category of places, {COUNTRY_LABELS[_.indexOf(COUNTRIES, country)]}</div>
                        <div className="chart-caption">Change relative to baseline (median values from the five‑week period 3 Jan – 6 Feb 2020)</div>
                        <hr className="ghost"/>
                        {
                            countryData && _.chunk(_.toPairs(MOBILITY_CATEGORIES), 3).map( (chunk,i) => <Row key={i}>
                                {
                                    chunk.map( (category, j) => <Col key={j}>
                                        <Fragment>
                                            <h6>{category[1]}</h6>
                                            <MobilityChangesWeeksChart data={ _.filter(countryData, ['metric', category[0]]) }/>
                                        </Fragment>                            
                                    </Col>)
                                }
                            </Row>)
                        }
                    </Col>
                </Row>                
            </section>            
        </Container>
    }


}
export default MobilityChangesWeeks

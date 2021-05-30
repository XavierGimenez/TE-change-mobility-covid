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
                    <Col xs={5}>
                        <h1>Mobility Changes</h1>
                        Make country clickables to explain several situations as of today
                        <span className="highlight year2020">year 2020</span> and <span className="highlight year2021">year 2021</span>
                        <div><small>Select country:</small></div>
                            <DropdownButton 
                                id="dropdown-item-button" 
                                variant="outline-info"
                                size="sm"
                                title={COUNTRY_LABELS[_.indexOf(COUNTRIES, this.state.country)]}>
                                {
                                    COUNTRY_LABELS.map( c => <Dropdown.Item key={c} onClick={() => this.setState({country: COUNTRIES[_.indexOf(COUNTRY_LABELS, c)]})}>
                                            { c }
                                        </Dropdown.Item>
                                    )
                                }
                            </DropdownButton>
                    </Col>
                    <Col xs={7}>
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

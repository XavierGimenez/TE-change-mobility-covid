import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import * as _ from 'lodash';

import { MOBILITY_CATEGORIES } from '../common/constants';
import MobilityVsReproductionRateChart from './MobilityVsReproductionRateChart'


class MobilityVsReproductionRate extends Component {



    constructor(props) {
        super(props);
        this.state = {
            mobilityCategory: _.first(_.keys(MOBILITY_CATEGORIES))
        };
    }



    render() {
        let { data } = this.props;
        let { mobilityCategory } = this.state;

        return <Container fluid>
            <section>
                <h1>Mobility Vs Reproduction</h1>
                <Row>
                    <Col xs={3}>
                        <ButtonGroup vertical>
                        {
                            _.toPairs(MOBILITY_CATEGORIES)
                                .map( (category, i) => <Button
                                    active={category[0] === mobilityCategory} 
                                    variant="outline-secondary" 
                                    key={i}
                                    onClick={() => this.setState({mobilityCategory:category[0]})}>
                                        { category[1] }
                                    </Button>)
                        }
                        </ButtonGroup>
                    </Col>
                    <Col>
                        <MobilityVsReproductionRateChart 
                            mobilityCategory={mobilityCategory} 
                            data={ 
                                _.chain(data)
                                    .filter(d => d.metric === mobilityCategory)
                                    .filter(d => (new Date(d.date)).getDay() === 1 )
                                    .value()
                            }
                        />
                    </Col>
                </Row>
                
            </section>            
        </Container>
    }
}
export default MobilityVsReproductionRate

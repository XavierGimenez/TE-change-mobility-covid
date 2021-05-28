import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import * as _ from 'lodash';

import MobilityVsReproductionRateChart from './MobilityVsReproductionRateChart'


class MobilityVsReproductionRate extends Component {



    constructor(props) {
        super(props);
        this.state = {};
    }



    render() {
        let { 
            data,
            mobilityCategory,
            step,
            stepProgress
        } = this.props;

        return <Container fluid>
                <h1>Mobility Vs Reproduction</h1>
                <Row>
                    <Col>
                        <MobilityVsReproductionRateChart 
                            step={step}
                            stepProgress={stepProgress}
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
        </Container>
    }
}
export default MobilityVsReproductionRate

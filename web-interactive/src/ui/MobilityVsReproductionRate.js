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
            showTimeline,
            mobilityCategory,
            step
        } = this.props;

        return <Container fluid>
                <Row>
                    <Col>
                        <MobilityVsReproductionRateChart 
                            step={step}
                            mobilityCategory={mobilityCategory} 
                            showTimeline={showTimeline}
                            data={ 
                                _.chain(_.get(data, 'ES'))
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

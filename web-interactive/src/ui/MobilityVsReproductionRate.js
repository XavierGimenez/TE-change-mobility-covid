import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import * as _ from 'lodash';

import { MOBILITY_CATEGORIES } from '../common/constants';
import MobilityVsReproductionRateChart from './MobilityVsReproductionRateChart'


class MobilityVsReproductionRate extends Component {



    render() {
        let { data } = this.props;

        return <Container fluid>
            <section>
                <h1>Mobility Vs Reproduction</h1>
                <MobilityVsReproductionRateChart  data={ _.filter(data, ['metric', _.first(_.keys(MOBILITY_CATEGORIES)) ]) }/>
                
            </section>            
        </Container>
    }
}
export default MobilityVsReproductionRate

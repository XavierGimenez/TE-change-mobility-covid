import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';
import MobilityChangesWeeksChart from './MobiliyChangesWeeksChart';



class MobilityChangesWeeks extends Component {



    render() {
        let { data } = this.props;
        return <Container>
            <h1>Mobility Changes</h1>
            {
                _.chunk(_.toPairs(MOBILITY_CATEGORIES), 3).map( chunk => <Row>
                    {
                        chunk.map( category => <Col>
                            <Fragment>
                                <h6>{category[1]}</h6>
                                <MobilityChangesWeeksChart data={ _.filter(data, ['metric', category[0]]) }/>
                            </Fragment>                            
                        </Col>)
                    }
                </Row>)
            }
        </Container>
    }


}
export default MobilityChangesWeeks

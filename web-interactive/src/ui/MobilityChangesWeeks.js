import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';
import MobilityChangesWeeksChart from './MobilityChangesWeeksChart';



class MobilityChangesWeeks extends Component {



    render() {
        let { data } = this.props;
        return <Container fluid>
            <section>
                <h1>Mobility Changes</h1>
               
                {
                    _.chunk(_.toPairs(MOBILITY_CATEGORIES), 3).map( (chunk,i) => <Row key={i}>
                        {
                            chunk.map( (category, j) => <Col key={j}>
                                <Fragment>
                                    <h6>{category[1]}</h6>
                                    <MobilityChangesWeeksChart data={ _.filter(data, ['metric', category[0]]) }/>
                                </Fragment>                            
                            </Col>)
                        }
                    </Row>)
                }
            </section>            
        </Container>
    }


}
export default MobilityChangesWeeks

import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';
import MobilityChangesWeeksChart from './MobilityChangesWeeksChart';



class MobilityChangesWeeks extends Component {



    render() {
        let { data } = this.props;
        return <Container fluid>
            <section className="text-center">
                <h1>Mobility Changes</h1>
                <Row className="justify-content-center">
                    <Col xs={5}>
                    aslka ls kalsk lfldjs flshjfs gfdk aslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdk
                    </Col>
                </Row>
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

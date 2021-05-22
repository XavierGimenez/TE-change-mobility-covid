import { React, Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';



class MobilityChangesWeeks extends Component {



    render() {
        return <Container>
            <h1>Mobility Changes</h1>
            {
                _.chunk(_.values(MOBILITY_CATEGORIES), 3).map( chunk => <Row>
                    {
                        chunk.map( category => <Col>
                            { 
                                <h6>{category}</h6>
                            }
                        </Col>)
                    }
                </Row>)
            }
        </Container>
    }


}
export default MobilityChangesWeeks

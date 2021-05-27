import React, { Component } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import * as _ from 'lodash';
import MobilityCyclePlotWeekdayChart from './MobilityCyclePlotWeekdayChart';
import { DAY_NAMES } from '../common/constants'; 


class MobilityCiclePlotWeekday extends Component {


    constructor(props) {
        super(props);
        this.state = {
            day: _.first(DAY_NAMES)
        };
    }



    render() {
        let { data } = this.props,
            groupedData;

        if(data)
            groupedData = _.groupBy(data, d => d.weekDay);

        return <Container fluid>
            <section>
                <Row>
                    <Col>
                        <h1>How was your day?</h1>
                        <p>
                            aslka ls kalsk lfldjs flshjfs gfdk aslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdk
                        </p>
                        <ButtonGroup size="sm">
                        { 
                            DAY_NAMES.map(day => <Button 
                                key={day+"1"}
                                variant="outline-info"
                                active={day === this.state.day}
                                onClick={() => this.setState({day})}>
                                    {day}
                                </Button>)
                        }
                        </ButtonGroup>
                    </Col>
                    <Col>
                        {   !_.isNil(groupedData) &&
                                _.toPairs(
                                    _.groupBy(
                                        _.get(groupedData, _.indexOf(DAY_NAMES, this.state.day)),
                                        d => d.metric
                                    )
                                ).map( (tuple, i) => {
                                    return <MobilityCyclePlotWeekdayChart
                                        key={i}
                                        category={tuple[0]}
                                        data={tuple[1]}
                                    />
                                })
                        }
                    </Col>
                </Row>
            </section>
        </Container>
    }
}
export default MobilityCiclePlotWeekday
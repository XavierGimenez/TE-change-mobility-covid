import React, { Component } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import * as _ from 'lodash';
import MobilityCyclePlotWeekdayChart from './MobilityCyclePlotWeekdayChart';
import { 
    DAY_NAMES,
    DAY_NAMES_LABEL,
    MOBILITY_CATEGORIES 
} from '../common/constants'; 


class MobilityCiclePlotWeekday extends Component {


    constructor(props) {
        super(props);
        this.state = {
            day: DAY_NAMES[1]
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
                    <Col xs={7}>
                        <h1>How was your day?</h1>
                        <p>
                            aslka ls kalsk lfldjs flshjfs gfdk aslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdkaslka ls kalsk lfldjs flshjfs gfdk
                        </p>
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col>
                        <div>Select a day of the week:</div>
                        <ButtonGroup size="sm">
                        { 
                            _.slice(DAY_NAMES_LABEL,1).concat(_.first(DAY_NAMES_LABEL))
                            .map(day => <Button 
                                key={day}
                                variant="outline-info"
                                active={DAY_NAMES[_.indexOf(DAY_NAMES_LABEL,day)] === this.state.day}
                                onClick={() => this.setState({day:DAY_NAMES[_.indexOf(DAY_NAMES_LABEL,day)]})}>
                                    {day}
                                </Button>)
                        }
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>
                            Explanation for residential and workplaces. Explanation for residential and workplaces. Explanation for residential and workplaces. Explanation for residential and workplaces. Explanation for residential and workplaces. Explanation for residential and workplaces. Explanation for residential and workplaces. 
                        </p>                        
                    </Col>
                    <Col>
                        <p>
                            The rest of the categories. The rest of the categories. The rest of the categories. The rest of the categories. The rest of the categories. The rest of the categories. The rest of the categories. The rest of the categories. The rest of the categories. 
                        </p>                        
                    </Col>
                </Row>
                <Row>
                    <Col>
                    {   !_.isNil(groupedData) &&
                                _.toPairs(
                                    _.groupBy(
                                        _.get(groupedData, _.indexOf(DAY_NAMES, this.state.day)),
                                        d => d.metric
                                    )
                                )
                                .filter(tuple => tuple[0] === 'residential_percent_change_from_baseline' || tuple[0] === 'workplaces_percent_change_from_baseline')
                                .map( (tuple, i) => <Row style={{marginBottom:'1em'}}>
                                        <Col xs={3} style={{borderRight:"1px solid rgba(42, 111, 219, 0.15)"}}>
                                            <h6 className="text-right">{MOBILITY_CATEGORIES[tuple[0]]}</h6>
                                        </Col>
                                        <Col>
                                            <MobilityCyclePlotWeekdayChart
                                                axis={i === 0? 'top':i === _.keys(MOBILITY_CATEGORIES).length?'bottom':'none'}
                                                key={i}
                                                category={tuple[0]}
                                                data={tuple[1]}
                                            />
                                        </Col>
                                    </Row>                                    
                                )
                        }
                    </Col>
                    <Col>
                        {   !_.isNil(groupedData) &&
                                    _.toPairs(
                                        _.groupBy(
                                            _.get(groupedData, _.indexOf(DAY_NAMES, this.state.day)),
                                            d => d.metric
                                        )
                                    )
                                    .filter(tuple => tuple[0] !== 'residential_percent_change_from_baseline' && tuple[0] !== 'workplaces_percent_change_from_baseline')
                                    .map( (tuple, i) => <Row style={{marginBottom:'1em'}}>
                                            <Col xs={3} style={{borderRight:"1px solid rgba(42, 111, 219, 0.15)"}}>
                                                <h6 className="text-right">{MOBILITY_CATEGORIES[tuple[0]]}</h6>
                                            </Col>
                                            <Col>
                                                <MobilityCyclePlotWeekdayChart
                                                    axis={i === 0? 'top':i === _.keys(MOBILITY_CATEGORIES).length?'bottom':'none'}
                                                    key={i}
                                                    category={tuple[0]}
                                                    data={tuple[1]}
                                                />
                                            </Col>
                                        </Row>          
                                    )
                        }
                    </Col>
                </Row>
            </section>
        </Container>
    }
}
export default MobilityCiclePlotWeekday
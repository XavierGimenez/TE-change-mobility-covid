import React, { Component, Fragment } from 'react';
import { Container, Row, Col, ButtonGroup, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import * as _ from 'lodash';
import MobilityCyclePlotWeekdayChart from './MobilityCyclePlotWeekdayChart';
import { 
    DAY_NAMES,
    DAY_NAMES_LABEL,
    MOBILITY_CATEGORIES,
    COUNTRY_LABELS, 
    COUNTRIES
} from '../common/constants'; 


class MobilityCiclePlotWeekday extends Component {


    constructor(props) {
        super(props);
        this.state = {
            country: 'ES'
        };
        this.linkedDate = this.linkedDate.bind(this);
        this.unsetLinkedDate = this.unsetLinkedDate.bind(this);
    }



    componentDidMount() {
        this.setState({day:DAY_NAMES[1]});
    }


    linkedDate(date) {
        this.setState({date})
    }

    unsetLinkedDate() {
        this.setState({date:null});
    }


    render() {
        let { data } = this.props,
            { day, country, date } = this.state,
            groupedData;

        if(data && day)
            groupedData = _.groupBy(_.get(data, country), d => d.weekDay);

        return <Fragment>
            <hr className="ghost"/>
            <Container>
                <Row>
                    <Col>
                        <p>
                            Google Community Mobility Reports can be helpful at providing insights into what has changed in response to policies aimed at combating COVID-19. However, movement trends over time show mixed phenomena since mobility variations can be either due to policies aimed at combating COVID-19, or because of more inherent reasons like people not going to places of work because of holiday    periods or public holidays, mobility variations between weekends and working days, or the citizenship not going to parks because of the period of the year.
                        </p>
                    </Col>
                </Row>
                <hr/>
                <Row className="align-items-end">
                    <Col xs={6}>
                        <p style={{margin:0}}>
                            Instead, changes in the mobility can be better understood by looking at one specific week day through all the time coverage of the mobilty reports. Each day of the week has its own idiosyncrasy, so although local gaps and spikes can still be present due to, e.g. public holidays, showing the cycle of the day-of-the-week data can reveal better effects because of the policies related to the COVID-19.
                        </p>
                    </Col>
                    <Col style={{marginBottom:'2rem'}}>
                        <div><small>Select day of the week:</small></div>
                        <ButtonGroup size="sm">
                        { 
                            _.slice(DAY_NAMES_LABEL,1).concat(_.first(DAY_NAMES_LABEL))
                            .map(day => <Button
                                key={day}
                                variant="outline-info"
                                active={DAY_NAMES[_.indexOf(DAY_NAMES_LABEL,day)] === this.state.day}
                                onClick={() => this.setState({day:DAY_NAMES[_.indexOf(DAY_NAMES_LABEL,day)]})}>
                                    {day.substring(0,3).toUpperCase()}
                                </Button>)
                        }
                        </ButtonGroup>  
                        <p></p>
                        <div><small>Select country:</small></div>
                        <DropdownButton 
                            id="dropdown-item-button" 
                            variant="outline-info"
                            size="sm"
                            title={COUNTRY_LABELS[_.indexOf(COUNTRIES, country)]}>
                            {
                                _.sortBy(COUNTRY_LABELS).map( c => <Dropdown.Item key={c} onClick={() => this.setState({country: COUNTRIES[_.indexOf(COUNTRY_LABELS, c)]})}>
                                        { c }
                                    </Dropdown.Item>
                                )
                            }
                        </DropdownButton>
                    </Col>                    
                </Row>
                <hr className="ghost"/>
                <Row>
                    <Col className="text-center">
                        <div className="chart-title">Day-of-the-week change in mobilty (%), by category of places, {COUNTRY_LABELS[_.indexOf(COUNTRIES, country)]}</div>
                        <div className="chart-caption">Change relative to baseline (median values from the five‑week period 3 Jan – 6 Feb 2020)</div>
                    </Col>
                </Row>   
                <hr className="ghost"/>                 
                <Row>
                    <Col>
                    {   !_.isNil(groupedData) &&
                                _.toPairs(
                                    _.groupBy(
                                        _.get(groupedData, _.indexOf(DAY_NAMES, day)),
                                        d => d.metric
                                    )
                                )
                                .filter(tuple => tuple[0] === 'residential_percent_change_from_baseline' || tuple[0] === 'workplaces_percent_change_from_baseline')
                                .reverse()
                                .map( (tuple, i) => <Row style={{marginBottom:'1em'}} key={i}>
                                        <Col xs={12}>
                                            <h6 style={{marginRight:'1em'}} className="text-right text-shadow">{MOBILITY_CATEGORIES[tuple[0]]}</h6>
                                        </Col>
                                        <Col>
                                            <MobilityCyclePlotWeekdayChart                                                
                                                axis={i === 0? 'top':i === _.keys(MOBILITY_CATEGORIES).length?'bottom':'none'}
                                                key={i}
                                                category={tuple[0]}
                                                data={tuple[1]}
                                                callback={this.linkedDate}
                                                callback2={this.unsetLinkedDate}
                                                country={country}
                                                date={date}
                                                day={day}
                                            />
                                        </Col>
                                    </Row>                                    
                                )
                        }
                        <p>
                            <strong>Residential and workplaces</strong> mirror each other for most of the countries, and reveal clearly the overall trend in mobility change due to the spread. Altough they are not comparable (residential category shows a change in duration, while others measure a change in total visitors) and its percentage change is limited (people already spend much of the day at these places), they show the steadily recovery on the road to normality.<br/><br/>Yet, there are still some countries like <span className="link" onClick={() => this.setState({country: "IN"})}>India</span> that are not leaving behind this reduction in mobility.
                        </p>    
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
                                    .map( (tuple, i) => <Row style={{marginBottom:'1em'}} key={i}>
                                            <Col xs={12}>
                                                <h6 style={{marginRight:'1em'}} className="text-right">{MOBILITY_CATEGORIES[tuple[0]]}</h6>
                                            </Col>
                                            <Col>
                                                <MobilityCyclePlotWeekdayChart
                                                    axis={i === 0? 'top':i === _.keys(MOBILITY_CATEGORIES).length?'bottom':'none'}
                                                    key={i}
                                                    category={tuple[0]}
                                                    data={tuple[1]}
                                                    callback={this.linkedDate}
                                                    callback2={this.unsetLinkedDate}
                                                    country={country}
                                                    date={date}
                                                    day={day}
                                                />
                                            </Col>
                                        </Row>          
                                    )
                        }
                    </Col>
                </Row>
            </Container>
        </Fragment>
    }
}
export default MobilityCiclePlotWeekday
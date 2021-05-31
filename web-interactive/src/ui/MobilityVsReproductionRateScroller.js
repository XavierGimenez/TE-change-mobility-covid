import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Row, Col} from 'react-bootstrap';
import * as _ from 'lodash';
import { Scrollama, Step} from 'react-scrollama';

import { MOBILITY_CATEGORIES } from '../common/constants';
import MobilityVsReproductionRate from './MobilityVsReproductionRate';


class MobilityVsReproductionRateScroller extends Component {



    constructor(props) {
        super(props);
        this.defaultMobilityCategory = _.keys(MOBILITY_CATEGORIES)[3];
        this.state = {
            // scrollama data
            data: 0,
            steps: [5, 10, 15, 20, 30, 40, 50, 60, 70, 75],
            progress: 0,    
            // set by default 'Retail and recreation'
            mobilityCategory: this.defaultMobilityCategory,
            showTimeline: false
        };
    }

    onStepEnter = e => {
        this.setState({ data: e.data });
      };
    
    onStepExit = ({ direction, data }) => {
        if (direction === 'up' && data === this.state.steps[0])
            this.setState({ data: 0 });
    };
    
    onStepProgress = ({ progress }) => {
        this.setState({ progress });
    };



    render() {
        const { 
            data, 
            progress,
            showTimeline,
            mobilityCategory } = this.state;



        return <div className="scrollama">
            <hr className="ghost"/>
            <hr className="ghost"/>
            <Container className="background-colored">
                <Row>
                    <Col/>
                    <Col xs={7} className="text-center">
                        <h1>Mobility constrains and its effect on the COVID-19 outbreak</h1>
                    </Col>
                    <Col/>
                </Row>             
                <hr className="ghost"/>   
                <Row>
                    <Col>
                        <p>
                            Since the outbreak of the 2019 novel coronavirus (COVID-19) pandemic, governments have been implementing containment measures aimed at mitigating the spread of the virus. Several policies restricted human mobility, intending to increase social distance, which has effectively slowed transmission. Restricting human mobility is an effective strategy used to control disease spread.
                        </p>
                        <p>
                            Mobility restrictions as a response to control the ongoing COVID-19 pandemic aims to have a direct impact on the rate at which coronavirus infection is spreading: The reproduction rate (known as R0) is a way of rating coronavirus or any disease's ability to spread, or in other words, it is the number of people that one infected person will pass on a virus to, on average. If the reproduction rate is higher than one, then the number of cases keeps increasing, while values lower than one mean that each existing infection causes less than one new infection, so the disease will decline and eventually die out.
                        </p>
                    </Col>
                </Row>
            </Container>
            <div className="graphics-container">
                <div className="graphic">
                    <MobilityVsReproductionRate 
                        mobilityCategory={mobilityCategory} 
                        showTimeline={showTimeline}
                        {...this.props}
                        step={data}
                        stepProgress={progress}
                    />
                </div>
                <div className="scroller">
                    {
                        /*
                            narrative storytelling for Spain
                        */
                    }
                    <Scrollama
                        onStepEnter={this.onStepEnter}
                        onStepExit={this.onStepExit}
                        progress
                        onStepProgress={this.onStepProgress}
                        offset={0.3}>
                            <Step data={5}>
                                <div className="step">
                                    <h3>How the mobilty restrictions and the reproduction rate correlate together?</h3>
                                    <p>
                                        To confirm that constraining human mobility has an impact on the reproduction rate, let's inspect an specific case, looking at how changes in mobility in <span className="highlight">{MOBILITY_CATEGORIES[mobilityCategory]}</span> in <span className="highlight">Spain</span> have been helpful at controlling the COVID-19 outbreak.
                                    </p>
                                </div>
                            </Step>
                            <Step data={10}>
                                <div className="step step-large">
                                    <p>
                                        <strong>At the beginning of March, with the reproduction rate at highest values, the infection was being able to spread rapidly through the population</strong>.
                                    </p>
                                    <p>
                                        The spread of the coronavirus had started likely weeks before: The virus was first confirmed to have spread to Spain on <u>31 January 2020</u>, and by the end of February the community transmission was started in the whole country.
                                    </p>
                                    <p>
                                        <u>On 13 March</u>, the State of Alarm was declared, initially for 15 days, and the lockdown was imposed on <u>14 March 2020</u>.
                                    </p>
                                </div>                                
                            </Step>

                            <Step data={15}>
                                <div className="step step-large">
                                    <p>
                                        As a result of the national lockdown, all residents are compelled to remain in their normal residences except to purchase food and medicines, work or attend emergencies. Lockdown restrictions also mandated the temporary closure of non-essential shops and businesses, including bars, restaurants, cafes, cinemas and commercial and retail businesses
                                    </p>
                                    <p>
                                        <u>On 23 March</u>, Spanish Primer Minister announces that he will take the petition to extend the State of Alarm in the nation until <u>11 April</u>.
                                    </p>
                                </div>                                
                            </Step>

                            <Step data={20}>
                                <div className="step">
                                    <p>
                                        <strong>Some weeks after the lockdown, the reproduction rate goes down to levels below 1</strong>, which means that the disease will eventually stop spreading and not enough new people are being infected to sustain the outbreak.
                                    </p>
                                    <p>On <u>13 April 2020</u>, there is a lifting of some restrictions and workers in some non-essential sectors are allowed to return to work. Some days later the government announces that children under the age of 14 will be able to go out on short walks with their parents or other adults living in the same household.
                                    </p>
                                </div>
                            </Step>
                            <Step data={30}>
                                <div className="step">
                                    <p>
                                        <strong>April and May are followed by with an intent of restoring at some extent levels of mobility</strong>. On <u>28 April</u>, the government announced a plan for easing lockdown restrictions progressively, based on health indicators.
                                    </p>
                                    <p>The state of alarm expired at midnight of <u>Sunday 21 June</u>, and Spain entered a "new normality" phase, in which restrictions such as maximum occupancy in shops are handled by each autonomous community independently. At the state level, the government maintained the obligation to wear masks in public transportation and all other places where a minimum distance of 1.5 metres cannot be maintained.
                                    </p>
                                </div>
                            </Step>
                            <Step data={40}>
                                <div className="step">
                                    <p>
                                        <strong><u>From July until September</u> there is a resurgence in the spread</strong>, and in reponse to the increase in the number of cases some regional governments forbide gatherings of more than 10 people in public or private spaces, and advised residents to stay at home unless strictly necessary. A number of restrictions were imposed, including closing nightclubs, banning smoking outdoors if social distancing was not possible, and compulsory wearing of face masks in public.
                                    </p>
                                    <p>
                                        The country recorded a series of high daily counts of infection since relaxing its restrictions in <u>June 2020</u>, with 3,715 cases reported on 19 August, giving it a cumulative figure of over 370,000 cases by that date. The country had the highest rate of infection in Europe, with 145 new cases per 100,000 population in the two weeks before <u>21 August 2020</u>, compared to 51 in France and 21 in the UK.
                                    </p>
                                </div>
                            </Step>
                            <Step data={50}>
                                <div className="step">
                                    <p>
                                        During <u>October</u>, and due to high values of the reproduction rate, some partial lock-downs are set again, and finally on <u>25 October</u>, the government reimposed a state of emergency across the country and introduced a national curfew to counter the resurgence in coronavirus. Local authorities were also given powers to ban travel across different regions. The curfew was initially set to last 15 days, but Prime Ministed said that he would ask Parliament to extend it if necessary.
                                    </p>                                    
                                </div>
                            </Step>
                            <Step data={60}>
                                <div className="step">
                                    <p>
                                        <strong>The end of the 2020 and the first months of 2021 have been a back and forth of travel restrictions, closures and partial lock-downs, aimed to find a balance between the economic impact of the measures and the healthcare system</strong>. As the first vaccines started being administered to the populations on December, a progressive easing on lockdown restrictions can be applied based on health indicators.
                                    </p>
                                    <p>
                                        <u>On 3 May</u>, Spain managed to achieve the government's objective to have at least 5 million people fully vaccinated for the first week of May, more than 10% of the total population, and on <u>9 May</u>, the State of emergency came to an end as Prime Minister refused to prolong it anymore, claiming that now it was the turn to trust "massive vaccination".
                                        Nowadays, mobility seems to point out to normal levels, while the reproduction rate remains below 1.
                                    </p>
                                </div>
                            </Step>
                            <Step data={70}>
                                <div className="step">
                                    <h3>How these last 14 months have been?</h3>
                                    <p>
                                        All this back-and-forth between lifting the policies on mobility restrictions while keeping the outbreak under control ends up giving a global picture of the overall situation over the last year, summarizing how the whole country has been behaving in terms of this balance between isolating the population when necessary and mantaining coronavirus' reproduction rate under values of 1.
                                    </p>
                                    <p style={{marginTop:"15vh"}}>
                                        Such relationship is shown between reproduction rate and the mobility category <span className="highlight">{MOBILITY_CATEGORIES[mobilityCategory]}</span> in Spain, but you can inspect other categories as well:
                                    </p>
                                    <p></p>
                                        <ButtonGroup vertical style={{marginLeft:"1vw"}}>
                                        {
                                            _.toPairs(MOBILITY_CATEGORIES)
                                                .map( (category, i) => <Button
                                                    active={category[0] === mobilityCategory} 
                                                    variant="outline-info" 
                                                    key={i}
                                                    onClick={() => this.setState({mobilityCategory:category[0]})}>
                                                        { category[1] }
                                                    </Button>)
                                        }
                                        </ButtonGroup>
                                        <br/><br/>
                                        <form style={{marginLeft:"1vw"}}>                                            
                                            <input
                                                name="showLine"
                                                type="checkbox"
                                                checked={this.state.showTimeline}
                                                onChange={() => { this.setState({showTimeline:!this.state.showTimeline})}}
                                            />
                                            <label style={{paddingLeft:"10px"}}>Show timeline</label>
                                        </form>
                                </div>
                            </Step>
                            <Step data={75}>
                                <div className="step"/>
                            </Step>
                    </Scrollama>
                </div>                
            </div>
        </div>;
    }
}
export default MobilityVsReproductionRateScroller

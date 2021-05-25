import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import * as _ from 'lodash';
import { Scrollama, Step} from 'react-scrollama';

import { MOBILITY_CATEGORIES } from '../common/constants';
import MobilityVsReproductionRate from './MobilityVsReproductionRate';


class MobilityVsReproductionRateScroller extends Component {



    constructor(props) {
        super(props);
        this.state = {
            // scrollama data
            data: 0,
            steps: [10, 20, 30],
            progress: 0,    
            mobilityCategory: _.first(_.keys(MOBILITY_CATEGORIES))  
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
        console.log(progress);
        this.setState({ progress });
    };



    render() {
        const { 
            data, 
            steps, 
            progress,
            mobilityCategory } = this.state;



        return <div className="scrollama">
            <div className="graphics-container">
                <div className="scroller">
                    <Scrollama
                        onStepEnter={this.onStepEnter}
                        onStepExit={this.onStepExit}
                        progress
                        onStepProgress={this.onStepProgress}
                        offset={0.3}>
                            <Step data={10}>
                                <div className="step">
                                    <p>Lorem ipsum est</p>
                                </div>                                
                            </Step>
                            <Step data={20}>
                                <div className="step">
                                    <p>Lorem ipsum est</p>
                                </div>
                            </Step>
                            <Step data={30}>
                            <ButtonGroup vertical>
                            {
                                _.toPairs(MOBILITY_CATEGORIES)
                                    .map( (category, i) => <Button
                                        active={category[0] === mobilityCategory} 
                                        variant="outline-secondary" 
                                        key={i}
                                        onClick={() => this.setState({mobilityCategory:category[0]})}>
                                            { category[1] }
                                        </Button>)
                            }
                            </ButtonGroup>
                            </Step>
                    </Scrollama>
                </div>
                <div className="graphic">
                    <p>{data}</p>
                    <MobilityVsReproductionRate mobilityCategory={mobilityCategory} {...this.props}/>
                </div>

            </div>
        </div>;
    }
}
export default MobilityVsReproductionRateScroller

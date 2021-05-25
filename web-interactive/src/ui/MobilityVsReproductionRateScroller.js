import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import * as _ from 'lodash';
import { Scrollama, Step} from 'react-scrollama';


class MobilityVsReproductionRateScroller extends Component {



    constructor(props) {
        super(props);
        this.state = {
            data: 0,
            steps: [10, 20, 30],
            progress: 0            
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
        const { data, steps, progress } = this.state;



        return <div className="scrollama">
            <div className="graphics-container">
                <div className="scroller">
                    <Scrollama
                        onStepEnter={this.onStepEnter}
                        onStepExit={this.onStepExit}
                        progress
                        onStepProgress={this.onStepProgress}
                        offset={0.3}
                        debug
                        >
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
                        {/*
                            steps.map(value => {
                                return (
                                <Step data={value} key={value}>
                                    <div className="step">
                                    <p>step value: {value}</p>
                                    <p>
                                        {Math.round(progress * 1000) / 10 + '%'}
                                    </p>
                                    </div>
                                </Step>);
                            })
                        */}
                    </Scrollama>
                </div>
                <div className="graphic">
                    <p>{data}</p>
                </div>

            </div>
        </div>;
    }
}
export default MobilityVsReproductionRateScroller

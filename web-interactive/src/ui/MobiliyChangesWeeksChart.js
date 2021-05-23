import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';
import * as d3 from 'd3';



class MobilityChangesWeeksChart extends Component {
    constructor(props){
        super(props)
        this.createChart = this.createChart.bind(this)

        // get ref to the main node so we will
        // want to get node's size
        this.elementRef = React.createRef();
    }
  


    componentDidMount() {
        this.createChart();
    }



    createChart() {
        const size = this.elementRef.current.getBoundingClientRect(),
            width = size.width,
            height = size.width * 0.75;
        
        let svg = d3.select(this.node)
            .attr('width', width)
            .attr('height', height)

    }



    render () {
        this.props.data && console.log(this.props.data);

        return <div ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityChangesWeeksChart;

import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';
import * as d3 from 'd3';
import {
    getNumOfWeeks,
    week
} from '../util/timeUtils';



class MobilityChangesWeeksChart extends Component {
    constructor(props){
        super(props)
        this.createChart = this.createChart.bind(this);
        this.updateChart = this.updateChart.bind(this);

        // get ref to the main node so we will
        // want to get node's size
        this.elementRef = React.createRef();
    }
  


    componentDidMount() {
        this.createChart();
        this.props.data && this.updateChart(this.props.data);        
    }



    componentDidUpdate(prevProps) {
        if(prevProps.data !== this.props.data) {
            this.updateChart(this.props.data);            
        }
    }



    createChart() {
        const size = this.elementRef.current.getBoundingClientRect();
        
        this.width = size.width;
        this.height = size.width * 0.75;
                
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height);
    }



    updateChart(data) {

//if(_.first(data).metric !== "residential_percent_change_from_baseline") return;

        // set ids to weeks
        data.forEach( d => {
            let date = new Date(d.date),
                year = date.getFullYear();
            
            d.weekDay = date.getDay();
            d.week = year + ( year === 2021? week(d.date) + getNumOfWeeks(2021) : week(d.date) );
        });
        let margin = {top: 50, right: 50, bottom: 50, left: 50},

            scaleX = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.weekDay))
                    .range([0 + margin.left, this.width - margin.right]),

            yDomain = d3.extent(data, d => d.mobility_change_from_baseline),

            scaleY = d3.scaleLinear()
                        .domain(yDomain)
                        .range([this.height - margin.bottom, margin.top]),

            scaleStrokeWidth = d3.scaleLinear()
                                    .domain(d3.extent(data, d => d.week))
                                    .range([0.25, 2]),

            scaleStrokeOpacity = d3.scaleLinear()
                                    .domain(d3.extent(data, d => d.week))
                                    .range([0.25, 1]),
            scaleColor = d3.scaleSequential(
                    [-30, 0, 20], 
                    d3.interpolateRgb("rgb(207, 216, 220)", "#4eeca3")
                ).clamp(true),
            
            lastWeek = +_.last(_.keys(_.groupBy(data, 'week'))),

            line = d3.line()
                    .x( d => scaleX(d.weekDay) )
                    .y( d => scaleY(d.mobility_change_from_baseline) )
                    .curve(d3.curveCardinal),
  
            scale2Gradient = d3.scaleLinear()
                                .domain([0,1])
                                .range(scaleY.domain());

        // graph
        let graph = this.svg.append('g');

        graph.append('g')
            .attr("fill", "none")
            .attr("stroke", "#444444")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll('path')
            .data( _.values(_.groupBy(data, 'week')) )
                .join("path")
                .attr("class", "weekly-line")
                .attr("d", d => line(d))
                .attr('fill', 'none')
                .attr('stroke-width', d => scaleStrokeWidth(_.first(d).week) )
                .attr('stroke-opacity', d => scaleStrokeOpacity(_.first(d).week) )
    }



    render () {        

        return <div ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityChangesWeeksChart;

import React, { Component } from 'react';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';
import * as d3 from 'd3';
import {
    getNumOfWeeks,
    week,
    formatDate
} from '../util/timeUtils';

import {
    callout
} from '../util/d3Utils';
import { snakeCase } from 'lodash';



class MobilityCyclePlotWeekdayChart extends Component {
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
        this.height = this.width * 0.3;
        this.margin = {top: 10, right:50, bottom: 80, left: 5};
                
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('overflow', 'visible');
    }



    updateChart(data) {

        let scaleX = d3.scaleTime()
                    .domain([
                        new Date(_.first(data).date),
                        new Date(_.last(data).date)
                    ])                    
                    .range([0 + this.margin.left, this.width - this.margin.right]),

            yDomain = d3.extent(data, d => d.mobility_change_from_baseline),

            scaleY = d3.scaleLinear()
                        .domain(yDomain)
                        .range([this.height - this.margin.bottom, this.margin.top]),
            scaleColor = d3.scaleSequential(
                    [-100, 100], 
                    d3.piecewise(
                        d3.interpolateRgb, 
                        ["#122c91", "#03283c", "#18928a", "#31dfb4", "#97d3a8", "#daa64b", "#f46c1d", "#f83915", "#f71211"]
                            .reverse()
                            .concat(
                                ["#122c91", "#03283c", "#18928a", "#31dfb4", "#97d3a8", "#daa64b", "#f46c1d", "#f83915", "#f71211"]
                            )
                    )
                ).clamp(true),
            //scaleColor = d3.scaleSqrt([-100, 0, 100], ["red", "white", "red"]),
            line = d3.line()
                    .x( d => scaleX(new Date(d.date)) )
                    .y( d => scaleY(d.mobility_change_from_baseline) )
                    //.curve(d3.curveMonotoneX),
                    .curve(d3.curveBasis),

            scale2Gradient = d3.scaleLinear()
                                .domain([0,1])
                                .range(scaleY.domain());

        // axis
        let xAxis = g => g
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(
            d3.axisBottom(scaleX)            
                .tickFormat(d3.timeFormat("%b"))
            )
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove())
            .call(g => g.selectAll(".tick text").attr('text-anchor', 'start').style('text-transform', 'uppercase'));

        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left*2.5},0)`)
            .call(
                d3.axisRight(scaleY).ticks(3)
            )
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove())
        
        this.svg.append("g").call(xAxis);
        this.svg.append("g").call(yAxis);


        // gradient
        let gradient = "myGradient" + this.props.category

        this.svg.append("linearGradient")
            .attr("id", gradient)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", scaleY(yDomain[0]))// this.height - this.margin.bottom)
            .attr("x2", 0)
            .attr("y2", scaleY(yDomain[1])) //this.margin.top)
            .selectAll("stop")
            .data(d3.ticks(0, 1, 10))
            .join("stop")
            .attr("offset", d => d)
            .attr("stop-color", (d,i) => {
                
                let stepMobility = (yDomain[1] -  yDomain[0]) / 10;

                if(this.props.category === 'retail_and_recreation_percent_change_from_baseline') {
                    console.log(yDomain, stepMobility, yDomain[0] + (stepMobility*i));
                }                    
                
                return  scaleColor(yDomain[0] + (stepMobility*i));
                //return scaleColor(scale2Gradient(d));
            });

        // graph        
        let graph = this.svg.append('g');

        // draw baseline
        graph.append('line')
            .attr('x1', this.margin.left - 10)
            .attr('x2', this.width - this.margin.right + 10)
            .attr('y1', scaleY(0))
            .attr('y2', scaleY(0))
            .attr("stroke", "#666")
            .attr("stroke-dasharray", [2, 3])
            .attr('stroke-width', 1)

        // draw lines for each metric
        _.values(
            _.groupBy(data, d => d.metric)
        ).forEach( d => {
        
            graph.append('g')
                .attr("fill", "none")
                .attr("stroke", "url(#" + gradient + ")")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .append('path')
                .datum(d)
                    .attr("d", line)
                    .style('cursor', 'pointer')
                    .attr('fill', 'none')
                    .style('mix-blend-mode', 'multiply')
                    .attr('stroke-width', 4 )
        });
    }



    render () {        

        return <div style={{maxWidth:"99%"}} ref={this.elementRef}>
            <h5>{MOBILITY_CATEGORIES[this.props.category]}</h5>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityCyclePlotWeekdayChart;

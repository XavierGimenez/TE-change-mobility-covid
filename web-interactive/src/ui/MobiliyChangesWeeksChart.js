import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOBILITY_CATEGORIES } from '../common/constants';
import * as _ from 'lodash';
import * as d3 from 'd3';
import {
    getNumOfWeeks,
    week,
    formatDate
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
        this.margin = {top: 50, right: 5, bottom: 50, left: 5};
                
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('overflow', 'visible');
    }



    updateChart(data) {

        // set ids to weeks
        data.forEach( d => {
            let date = new Date(d.date),
                year = date.getFullYear();
            
            d.weekDay = date.getDay();
            d.week = year + ( year === 2021? week(d.date) + getNumOfWeeks(2021) : week(d.date) );
        });
        

        let scaleX = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.weekDay))
                    .range([0 + this.margin.left, this.width - this.margin.right]),

            yDomain = d3.extent(data, d => d.mobility_change_from_baseline),

            scaleY = d3.scaleLinear()
                        .domain(yDomain)
                        .range([this.height - this.margin.bottom, this.margin.top]),

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

        // gradient for the weekly lines
        let gradient = "uid-gradient";

        this.svg.append('defs')
            .append("linearGradient")
            .attr("id", gradient)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", this.height - this.margin.bottom)
            .attr("x2", 0)
            .attr("y2", this.margin.top)
            .selectAll("stop")
            .data(d3.ticks(0, 1, 10))
                .join("stop")
                .attr("offset", d => d)
                .attr("stop-color", d => scaleColor(scale2Gradient(d)) );
                                
        // graph        
        let graph = this.svg.append('g');

        graph.append('g')
            .attr("fill", "none")
            .attr("stroke", "url(#" + gradient + ")")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll('path')
            .data( _.values(_.groupBy(data, 'week')) )
                .join("path")
                .attr("class", "weekly-line")
                .attr("d", d => line(d))
                .style('cursor', 'pointer')
                .attr('fill', 'none')
                .attr('stroke-width', d => scaleStrokeWidth(_.first(d).week) )
                .attr('stroke-opacity', d => scaleStrokeOpacity(_.first(d).week) )

        // clone last week, use it as a highlight border
        // and highlight last week
        graph.selectAll(".weekly-line")
            .filter( d => _.first(d).week === lastWeek)
            .clone()
            .attr('class', ".weekly-line-border")
            .attr('stroke-width', scaleStrokeWidth(lastWeek)+ 7)
            .attr('stroke-opacity', 1)
            .attr('stroke', '#f8f8ee');
      
        let lastLine = graph.selectAll(".weekly-line")
            .filter( d => _.first(d).week === lastWeek)
            .attr('stroke', '#01e299')
            .attr('stroke-opacity', 1)
            .attr('stroke-width', scaleStrokeWidth(lastWeek)+ 2)
            .raise();

        let callout = (g, value) => {
                if (!value) return g.style("display", "none");

                   g
                        .style("display", null)
                        .style("pointer-events", "none")
                        .style("font", "10px sans-serif");

                    const path = g.selectAll("path")
                        .data([null])
                        .join("path")
                        .attr("fill", "white")
                        .attr("stroke", "black");

                    const text = g.selectAll("text")
                        .data([null])
                        .join("text")
                        .call(text => text
                            .selectAll("tspan")
                            .data((value + "").split(/\n/))
                            .join("tspan")
                                .attr("x", 0)
                                .attr("y", (d, i) => `${i * 1.1}em`)
                                .style("font-weight", (_, i) => i ? null : "bold")
                                .text(d => d)
                        );

                    const { x, y, width: w, height: h } = text.node().getBBox();

                    text.attr("transform", `translate(${-w / 2},${15 - y})`);
                    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
        }

        // add tooltip
        const tooltip = this.svg.append("g");
        graph
            .selectAll(".weekly-line")
            .on("mouseover", function(event, d) {
                d3.select(this).attr('stroke', 'black').raise();
                const pointer = d3.pointer(event, this);
                /*const bisect = d3.bisector(d => d.weekDay).left;                
                const weekDay = scaleX.invert( pointer[0] );
                const index = bisect(data, weekDay, 1);
                const a = data[index - 1];
                const b = data[index];                
                const datum = b && (weekDay - a.weekDay > b.weekDay - weekDay) ? a:b;*/
                
                tooltip
                    //.attr("transform", `translate(${scaleX(datum.weekDay)},${scaleY(datum.mobility_change_from_baseline)})`)
                    .attr("transform", `translate(${pointer[0]},${pointer[1] + 10})`)
                    .call(
                        callout, 
                        `${formatDate(new Date(_.first(d).date))}`
                    );
            })
            .on("mouseout", function() {
                tooltip.call(callout, null);
                d3.select(this).attr('stroke', d => _.first(d).week === lastWeek ? '#01e299':null);
            });

    }



    render () {        

        return <div ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityChangesWeeksChart;

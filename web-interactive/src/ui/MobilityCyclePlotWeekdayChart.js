import React, { Component } from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';
import {
    formatDate2
} from '../util/timeUtils';

import {
    callout
} from '../util/d3Utils';



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
        this.props.data && this.updateChart(this.props.data, this.props.callback);        
    }


    componentDidUpdate(prevProps) {
        
        if(prevProps.country !== this.props.country ||
            prevProps.day !== this.props.day)
            this.updateChart(this.props.data, this.props.callback);            

        if(prevProps.date !== this.props.date) {
            if(_.isNull(this.props.date))
                this.svg.select('line.date-hovered').remove()
            else
                this.highlightDate();
        }            
    }



    createChart() { 
        const size = this.elementRef.current.getBoundingClientRect();
        
        this.width = size.width;
        this.height = this.width * 0.25;
        this.margin = {top: 0, right:30, bottom: 40, left: 40};
                
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('overflow', 'visible');
        
        this.svg.on("mouseleave", () => this.props.callback2());
    }


    highlightDate() {
        this.svg.select('line.date-hovered').remove();

        this.svg.append('line')
            .attr('class', 'date-hovered')
            .attr('x1', Math.round(this.scaleX(this.props.date)))
            .attr('x2', Math.round(this.scaleX(this.props.date)))
            .attr('y1', this.margin.top)
            .attr('y2', this.height - this.margin.bottom)
            .attr('stroke', '#d0d0d0')
            .attr('stroke-width', 2)
            .lower()
    }


    updateChart(data, callback) {
        let firstDate = new Date(_.first(data).date),
            lastDate = new Date(_.last(data).date);
        
        firstDate.setMonth(firstDate.getMonth() - 1 ); // not scalable for all scenarios...
        
        let scaleX = d3.scaleTime()
                    .domain([firstDate, lastDate])
                    .range([0 + this.margin.left, this.width - this.margin.right]),
            yDomain = d3.extent(data, d => d.mobility_change_from_baseline),
            maxyDomain = d3.max(yDomain, d => Math.abs(d)),
            scaleY = d3.scaleLinear()
                        .domain(yDomain)
                        .range([this.height - this.margin.bottom, this.margin.top]).clamp(true),
            scaleColor = d3.scaleSequential(
                    //[-100, 100], // first approach, considering that the % of change can be comparable through all the categories
                    [-maxyDomain, maxyDomain], //best approach, each category refering itself in terms of percentual change
                    d3.piecewise(
                        d3.interpolateRgb,
                        ["#122c91", "#03283c", "#18928a", "#31dfb4", "#97d3a8", "#daa64b", "#f46c1d", "#f83915", "#f71211"]
                            .reverse()
                            .concat(
                                ["#122c91", "#03283c", "#18928a", "#31dfb4", "#97d3a8", "#daa64b", "#f46c1d", "#f83915", "#f71211"]
                            )
                    )
                ).clamp(true),            
            line = d3.line()
                    .x( d => scaleX(new Date(d.date)) )
                    .y( d => scaleY(d.mobility_change_from_baseline) )
                    .curve(d3.curveBasis);
                          
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.svg.selectAll("*").remove();

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
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(
                d3.axisRight(scaleY)
                .ticks(3)
                .tickFormat( tick => tick === 0 ? "" : tick)
            )
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove())
            .call(g => g.selectAll(".tick text").attr('text-anchor', 'end'));
        
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
                
                // first approach (useless since the categories are not comparable)
                // if our scale color is always -100,100, but
                // every category has its own variation range
                // so we have to distribute 10 colors from
                // our colorScale along the height of the gradient (which
                // is the height of the whole line)                
                let stepMobility = (yDomain[1] -  yDomain[0]) / 10;                
                return  scaleColor(yDomain[0] + (stepMobility*i));
            });

        // graph        
        let graph = this.svg.append('g');

        const tooltip = this.svg.append("g");

        // draw baseline
        graph.append('line')
            .attr('x1', this.margin.left - 10)
            .attr('x2', this.width - this.margin.right + 10)
            .attr('y1', scaleY(0))
            .attr('y2', scaleY(0))
            .attr("stroke", "#666")
            .attr("stroke-dasharray", [1, 5])
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
                    .attr('opacity', 0.8)
                    .attr('stroke-width', 3 )
                    .on("mouseenter", function(event) {
                        const pointer = d3.pointer(event, this);
                        // pending to apply bisect to get the data
                        tooltip
                            .attr("transform", `translate(${pointer[0]},${pointer[1] + 10})`)
                            .call(
                                callout, 
                                `${formatDate2(new Date(scaleX.invert(pointer[0])))}`
                            );
                        callback && callback(
                            new Date(scaleX.invert(pointer[0]))
                        );
                    })
                    .on("mouseleave", function() {
                        tooltip.call(callout, null);
                    });
            
            graph.append('circle')
                .attr('cx', scaleX(scaleX.domain()[1]))
                .attr('cy', scaleY(_.last(data).mobility_change_from_baseline))
                .attr('r', 4)
                .attr('stroke', 'whitesmoke')
                .attr('stroke-width', 2)
                .attr("fill", "url(#" + gradient + ")")
                .on("mouseenter", function(event) {
                    const pointer = d3.pointer(event, this);
                    tooltip
                        .attr("transform", `translate(${pointer[0]},${pointer[1] + 10})`)
                        .call(
                            callout, 
                            `${formatDate2(new Date(scaleX.invert(pointer[0])))}`
                        );
                })
                .on("mouseleave", function() {
                    tooltip.call(callout, null);
                });

            graph.append('text')
                .attr('class', 'text-shadow')
                .attr('x', this.margin.left)
                .attr('y', scaleY(0) - 3)
                .attr("alignment-baseline", "end")
                .attr('fill', '#555')
                .text("Baseline")
        });
    }



    render () {        

        return <div style={{maxWidth:"99%"}} ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityCyclePlotWeekdayChart;

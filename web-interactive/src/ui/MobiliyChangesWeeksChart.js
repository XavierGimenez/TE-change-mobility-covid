import React, { Component } from 'react';
import { DAY_NAMES } from '../common/constants';
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
        this.height = size.width * 0.5;
        this.margin = {top: 10, right:50, bottom: 80, left: 5};
                
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
                                    .range([0.25, 0.7]),
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

        // axis
        let xAxis = g => g
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(
            d3.axisBottom(scaleX)
                .tickValues(_.range(0,7,1))
                .tickFormat( tick => DAY_NAMES[Math.round(tick)])
            )
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove())

        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left*2.5},0)`)
            .call(d3.axisRight(scaleY)
                .ticks(4)
                .tickSize(0)
                .tickFormat( tick => tick == 0 ? "" : tick)
            )
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick:not(:first-of-type) line")
                .attr("stroke-opacity", 0.5)
                .attr("stroke-dasharray", "2,2"))
            .call(g => g.selectAll(".tick text")
                .attr("x", d => d === 0? 5:-25)
                .attr("dy", -4))
        
        this.svg.append("g").call(xAxis);
        this.svg.append("g").call(yAxis);

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

        const voronoi = d3.Delaunay
            .from(
                data, d => scaleX(d.weekDay), d => scaleY(d.mobility_change_from_baseline))
            .voronoi([
                this.margin.left,
                this.margin.top,
                this.width - this.margin.right,
                this.height - this.margin.bottom
            ]);


        graph.append('g')
            .attr("fill", "none")
            //.attr("stroke", "url(#" + gradient + ")")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll('path')
            .data( _.values(_.groupBy(data, 'week')) )
                .join("path")
                .attr("class", "weekly-line")
                .attr("d", d => line(d))
                .style('cursor', 'pointer')
                .attr('fill', 'none')
                .attr('stroke', d => (new Date(_.first(d).date)).getFullYear() === 2021? '#01e299':'#666666') //'#f86a6f')
                .attr('stroke-width', d => scaleStrokeWidth(_.first(d).week) )
                .attr('stroke-opacity', 0.3 ) // d => scaleStrokeOpacity(_.first(d).week) )

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

        // voronoi
        let lineVoronoied;

        const paths = graph
            .append("g")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("d", (d, i) => voronoi.renderCell(i))
            .style("fill", "none")
            .style("stroke", "none");
        paths
            .on("mouseenter", function(event) {
                const pointer = d3.pointer(event, this);
                const value = event.target.__data__;

                tooltip
                    .attr("transform", `translate(${pointer[0]},${pointer[1] + 10})`)
                    .call(
                        callout, 
                        `${formatDate(new Date(value.date))}`
                    );
                
                lineVoronoied = graph.selectAll(".weekly-line")
                    .filter(d => _.first(d).week === value.week);

                lineVoronoied.clone()
                    .attr('class', "weekly-line-border")
                    .attr('stroke-width', scaleStrokeWidth(lastWeek)+ 7)
                    .attr('stroke-opacity', 1)
                    .attr('stroke', 'whitesmoke')
                    .raise();
                
                lineVoronoied
                    .attr('stroke', 'rgb(99, 69, 180)')
                    .attr('stroke-width', 3)
                    .attr('stroke-opacity', 1)
                    .raise();
            })
            .on("mouseleave", function() {
                tooltip.call(callout, null);
                lineVoronoied
                    .attr('stroke', d => (new Date(_.first(d).date)).getFullYear() === 2021? '#01e299':'#666666') //'#f86a6f')
                    .attr('stroke-width', d => scaleStrokeWidth(_.first(d).week) )
                    .attr('stroke-opacity', 0.3);
                graph.selectAll(".weekly-line-border").remove();
            });

        // add baseline
        graph.append('line')
            .attr('x1', this.margin.left - 10)
            .attr('x2', this.width - this.margin.right + 10)
            .attr('y1', scaleY(0))
            .attr('y2', scaleY(0))
            .attr("stroke", "#333")
            .attr('stroke-width', 1)
            .attr("stroke-dasharray", [2,2])
        graph.append('text')
            .attr('class', 'text-shadow')
            .attr('font-size', 10)
            .attr('font-weight', 500)
            .attr('x', -this.margin.left*6)
            .attr('y', scaleY(0))
            .attr("alignment-baseline", "middle")
            .text("Baseline")
    }



    render () {        

        return <div style={{maxWidth:"99%"}} ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityChangesWeeksChart;

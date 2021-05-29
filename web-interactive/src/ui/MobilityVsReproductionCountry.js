import React, { Component } from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';
import {hexbin} from 'd3-hexbin';



class MobilityVsReproductionCountry extends Component {
    constructor(props){
        super(props)
        this.createChart = this.createChart.bind(this);
        this.updateChart = this.updateChart.bind(this);

        // get ref to the main node so we will
        // want to get node's size
        this.elementRef = React.createRef();
    }
  


    componentDidMount() {
        this.createChart(this.props.data);
        this.props.data && this.updateChart(this.props.data);        
    }



    componentDidUpdate(prevProps) {
        if(prevProps.data !== this.props.data) {
            this.updateChart(this.props.data);            
        }
    }



    createChart(data) { 
        const size = this.elementRef.current.getBoundingClientRect();
        this.width = size.width;
        this.height = this.width * 0.75;
        this.margin = {top: 50, right:50, bottom: 50, left: 50};

        this.scaleX = d3.scaleLinear()
            .domain(
                d3.extent(data, d => d.mobility_change_from_baseline)
                    .map( (d,i) => {
                        return i === 0? d:(d<10? 10:d)
                })
            )
            .range([0 + this.margin.left, this.width - this.margin.right]);

        this.scaleY = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.reproduction_rate)])
            .range([this.height - this.margin.bottom, this.margin.top]);
        
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('overflow', 'visible');

        // add layers
        this.placeHolderContours = this.svg.append('g');
    }



    updateChart(data) {        
        this.svg.selectAll("*").remove();
        // graph        
        let graph = this.svg.append('g');     
        let radius = 6;
        let _hexbin = hexbin()
        .x(d => this.scaleX(d.mobility_change_from_baseline))
        .y(d => this.scaleY(d.reproduction_rate))
            .radius(radius * this.width / (this.height - 1))
            .extent([[this.margin.left, this.margin.top], [this.width - this.margin.right, this.height - this.margin.bottom]])
        
        let bins = _hexbin(data);
        let color = d3.scaleSequential(
                //d3.interpolateBlues
                d3.piecewise(d3.interpolateHsl, ['#122c91', '#2a6fdb', '#48d6d2', '#81e9e6', 'whitesmoke'].reverse())
            )
            .domain([0, d3.max(bins, d => d.length) / 2]).clamp(true);

        let r = d3.scaleSqrt()
            .domain([0, d3.max(bins, d => d.length)])
            .range([0, _hexbin.radius() * Math.SQRT2]);


        graph.append("g")
            .selectAll("path")
            .data(bins)
            .join("path")
            .attr('stroke', 'whitesmoke')
            .attr('stroke-opacity', 0.8)
            .attr("d", _hexbin.hexagon())
            //.attr("d", d=> _hexbin.hexagon( r(d.length) ))
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("fill", d => color(d.length));

        // threshold lines
        graph.append('line')                
                .attr('class','treshold-line')
                .attr("x1", this.margin.left)
                .attr("y1", this.scaleY(1))
                .attr("x2", this.width - this.margin.right)
                .attr("y2", this.scaleY(1));
        
        graph.append('line')
            .attr('class','treshold-line')
            .attr("y1", this.margin.top)
            .attr("x1", this.scaleX(0))
            .attr("y2", this.height - this.margin.bottom)
            .attr("x2", this.scaleX(0));
        
        graph.selectAll('.treshold-line')
            //.style('mix-blend-mode','color-burn')
            .style("stroke-dasharray",[1, 3])
            .style("stroke-width", 1)
            .style("stroke", '#333')
            .style('stroke-opacity', 0.5);
            
    
        // vertical axis
        let yAxisLabels = graph.append('g')
            .attr('transform', 'translate(' + this.margin.left/2 + ',' + this.scaleY(1) + ') rotate(-90) ')
            .attr('fill', '#777')
        let xAxisLabels = graph.append('g')
            .attr('transform', 'translate(' + this.scaleX(0) + ',' + (this.height - this.margin.bottom) + ')')
            .attr('fill', '#777')
            
            
        yAxisLabels.append('text')
            .attr('dy',0)
            .attr('y', -this.margin.left/4)
            .style('text-anchor', 'middle')
            .style('text-shadow', null)
            .text('R0');

        xAxisLabels.append('text')
            .attr('dy',0)
            .attr('y', this.margin.bottom/1.5)
            .style('text-anchor', 'middle')
            .style('text-shadow', null)
            .text('Mobility change (%)')

        let yAxis = g => g.attr("transform", `translate(${this.margin.left},0)`)
            .call(
                d3.axisLeft(this.scaleY)
                .ticks(3)
                .tickSize(0)
                //.tickFormat( tick => tick === 1 ? "" : tick)
            )
            .call( 
                g => g.selectAll('*')
                .attr('stroke-width', 0)
                .attr('stroke', '#d0d0d0')
            );
        let xAxis = g => g.attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(
                d3.axisBottom(this.scaleX)
                .ticks(3)
                .tickSize(0)
            )
            .call( 
                g => g.selectAll('*')
                    .attr('stroke-width', 0)
                    .attr('stroke', '#d0d0d0')
            );
        this.svg.append("g").call(xAxis);
        this.svg.append("g").call(yAxis);
    }



    render () {        

        return <div style={{maxWidth:"99%"}} ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityVsReproductionCountry;

import React, { Component } from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';



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
        this.height = this.width * 0.5;
        this.margin = {top: 25, right:25, bottom: 25, left: 25};

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

        let contours = d3.contourDensity()
                        .x(d => this.scaleX(d.mobility_change_from_baseline))
                        .y(d => this.scaleY(d.reproduction_rate))
                        .size([this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.right])
                        .bandwidth(30)
                        .thresholds(30)(data),
            colors = ['#122c91', '#2a6fdb', '#48d6d2', '#81e9e6', '#fefcbf'],
            scaleColorLinear = d3.scaleLinear()
                .domain(d3.range(0,1,1/colors.length))
                .range(colors)
                .interpolate(d3.interpolateLab)
                .clamp(true)

            
        const threshold_domain = contours.map(d => d.value),
            scaleColor = d3.scaleOrdinal()
                                .domain(contours.map(d => d.value))
                                .range(d3.quantize(scaleColorLinear, threshold_domain.length));

        // graph        
        let graph = this.svg.append('g');

        graph
            .attr("fill", "none")
            .attr("stroke", "whitesmoke")
            .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(contours)
        .enter().append("path")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", (d, i) => 1 - (i / 10) )
            .attr('fill-opacity', 0.75)
            .attr("fill", d => scaleColor(d.value))
            .attr("d", d3.geoPath());
    }



    render () {        

        return <div style={{maxWidth:"99%"}} ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
        
    }


}

export default MobilityVsReproductionCountry;

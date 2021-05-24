import React, { Component } from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';
import {
    textWrap
} from '../util/d3Utils';



class MobilityVsReproductionRateChart extends Component {
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



    createChart() {
        const size = this.elementRef.current.getBoundingClientRect();
        
        this.width = size.width;
        this.height = size.width * 0.5;
        this.margin = {top: 10, right:50, bottom: 180, left: 100};
                
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('overflow', 'visible');
    }


    axisLabels(graph, scaleX, scaleY) {
        const markerBoxWidth = 8,
            markerBoxHeight = 8,
            refX = markerBoxWidth / 2,
            refY = markerBoxHeight / 2,
            markerWidth = markerBoxWidth / 2,
            markerHeight = markerBoxHeight / 2,
            arrowPoints = [[0, 0], [0, 8], [8, 4]];

        // Add the arrowhead marker definition to the svg element
        this.svg
            .append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
            .attr('refX', refX)
            .attr('refY', refY)
            .attr('markerWidth', markerBoxWidth)
            .attr('markerHeight', markerBoxHeight)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()(arrowPoints))
            .attr('stroke', 'black');
        
        let offset = 50;
        
        // vertical axis
        let yAxisLabels = graph.append('g')
            .attr('transform', 'translate(' + this.margin.left/2 + ',' + scaleY(1) + ') rotate(-90) ');
        
        yAxisLabels.append('text')
            .attr('dy',0)
            .attr('y', -this.margin.left/2)
            .attr('font-family', 'Arial')
            .attr('font-size', 11)
            .attr('font-weight', 'bold')
            .attr('class', 'axis-label-main-2')
            .style('text-anchor', 'middle')
            .text('Reproduction rate')
        setTimeout(() => {

        this.svg.selectAll('.axis-label-main-2')
            .call(textWrap, 50)
        }, 0);
        yAxisLabels.append('text')
            .text('Increasing')
            .style('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('x', 10)
            .attr('y', 0)
            .attr('font-size', 11)
            .attr('font-family', 'Arial');

        yAxisLabels.append('text')
            .text('Decreasing')
            .style('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .attr('x', -10)
            .attr('y', 0)
            .attr('font-size', 11)
            .attr('font-family', 'Arial');
        
        yAxisLabels.append('path')
            .attr('d', d3.line()([
            [0 + offset*1.5, 0],
            [0 + offset*1.5 + 20, 0]]
            ))
            .attr('stroke', 'black').attr('marker-end', 'url(#arrow)').attr('fill', 'none');
        
        yAxisLabels.append('path')
            .attr('d', d3.line()([
            [0 - offset*1.5, 0],
            [0 - offset*1.5 - 20, 0]]
            ))
            .attr('stroke', 'black').attr('marker-end', 'url(#arrow)').attr('fill', 'none');

        // horizontal axis
        let xAxisLabels = graph.append('g')
            .attr('transform', 'translate(' + scaleX(0) + ',' + (this.height - this.margin.top/2) + ')');

        xAxisLabels.append('text')
            .attr('dy',0)
            .attr('y', this.margin.bottom/4)
            .attr('font-family', 'Arial')
            .attr('font-size', 11)
            .attr('font-weight', 'bold')
            .attr('class', 'axis-label-main')
            .style('text-anchor', 'middle')
            .text('Weekly change in mobility');

        setTimeout(() => {
            this.svg.selectAll('.axis-label-main')
                .call(textWrap, 100);
        }, 0); 

        graph.append('text')
        .text('More mobility')
        .style('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('x', scaleX(0) + 10)
        .attr('y', this.height - this.margin.top/2)
        .attr('font-size', 11)
        .attr('font-family', 'Arial')

        graph.append('text')
            .text('Less mobility')
            .style('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .attr('x', scaleX(0) - 10)
            .attr('y', this.height - this.margin.top/2)
            .attr('font-size', 11)
            .attr('font-family', 'Arial');


        graph.append('path')
            .attr('d', d3.line()([
            [scaleX(0) + 100, this.height - this.margin.top/2],
            [scaleX(0) + 100 + 20, this.height - this.margin.top/2]]
            ))
            .attr('stroke', 'black').attr('marker-end', 'url(#arrow)').attr('fill', 'none');

        graph.append('path')
            .attr('d', d3.line()([
            [scaleX(0) - 100, this.height - this.margin.top/2],
            [scaleX(0) - 100 - 20, this.height - this.margin.top/2]]
            ))
            .attr('stroke', 'black').attr('marker-end', 'url(#arrow)').attr('fill', 'none');
    }


    updateChart(_data) {

        // decide how often we pick the data points
        let data = _.filter(_data, d => (new Date(d.date)).getDay() === 1 );
        
        let scaleX = d3.scaleLinear()
                        .domain(
                            // put some positive margin in the mobility axis 
                            d3.extent(data, d => d.mobility_change_from_baseline)
                                .map( (d,i) => {
                                    return i === 0? d:(d<10? 10:d)
                                })
                        )
                        .range([0 + this.margin.left, this.width - this.margin.right]),
            scaleY = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.reproduction_rate)])
                        .range([this.height - this.margin.bottom, this.margin.top]),
            contours = d3.contourDensity()
                        .x(d => scaleX(d.mobility_change_from_baseline))
                        .y(d => scaleY(d.reproduction_rate))
                        .size([this.width, this.height])
                        .bandwidth(30)
                        .thresholds(30)
                        (data),
            //colors = ["#f8f8ee","#e66b4c"],
            colors = ["whitesmoke","#e66b4c"],
            scaleColorLinear = d3.scaleLinear()
                .domain(d3.range(0,1,1/colors.length))
                .range(colors)
                .interpolate(d3.interpolateLab),
            threshold_domain = contours.map(d => d.value),
            line = d3.line()
                    .x(d => scaleX(d.mobility_change_from_baseline))
                    .y(d => scaleY(d.reproduction_rate))
                    .curve(d3.curveCardinal.tension(0.5)),
            scaleColor = d3.scaleOrdinal()
                    .domain(contours.map(d => d.value))
                    .range(d3.quantize(scaleColorLinear, threshold_domain.length));

        // axis                 
        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(scaleY))
            .call( 
                g => g.selectAll('*')
                .attr('stroke-width', 0)
                .attr('stroke', '#d0d0d0')
            );
        let xAxis = g => g
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(scaleX))
            .call( 
                g => g.selectAll('*')
                    .attr('stroke-width', 0)
                    .attr('stroke', '#d0d0d0')
            );
        this.svg.append("g").call(xAxis);
        this.svg.append("g").call(yAxis);

        let graph = this.svg.append('g');

        // threshold lines
        graph.append('line')
            .attr('class','treshold-line')
            .attr("x1", this.margin.left)
            .attr("y1", scaleY(1))
            .attr("x2", this.width - this.margin.right)
            .attr("y2", scaleY(1));
        
        graph.append('line')
            .attr('class','treshold-line')
            .attr("y1", this.margin.top)
            .attr("x1", scaleX(0))
            .attr("y2", this.height - this.margin.bottom)
            .attr("x2", scaleX(0));
        
        graph.selectAll('.treshold-line')
            .style("stroke-dasharray",[2, 2])
            .style("stroke-width", 1)
            .style("stroke", '#c0c0c0')//'#e8e8d7')
            .style('stroke-opacity', 1);

    
        // countours
        graph.append("g")
            .attr("fill", "none")
            .attr("stroke", "whitesmoke") //"#f3b6a3")
            .attr("stroke-linejoin", "round")
            .selectAll("path")
            .data(contours)
                .enter().append("path")
                    .attr("stroke-width", 1)
                    .attr("stroke-opacity", (d, i) => 0.7 - (i / 10) )
                .attr("fill", d => scaleColor(d.value))
                .attr("d", d3.geoPath());

        // axis labels
        this.axisLabels(graph, scaleX, scaleY);
    }



    render() {
        return <div style={{maxWidth:"99%"}} ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
    }
}
export default MobilityVsReproductionRateChart;
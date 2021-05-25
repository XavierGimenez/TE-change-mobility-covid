import React, { Component } from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';
import {
    callout,
    textWrap
} from '../util/d3Utils';
import {
    formatDate2
} from '../util/timeUtils';
import { join } from 'lodash';


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



    componentDidUpdate(prevProps) {
        
        if(prevProps.mobilityCategory !== this.props.mobilityCategory) {
            this.updateChart(this.props.data, prevProps.data);
        }

        this.evaluateCaptions();        
    }



    showTooltipDynamic(n) {
        const data = this.props.data.slice(0, Math.ceil(n+1)),
            datum = _.last(data);
        
        let x = this.scaleX(datum.mobility_change_from_baseline),
            y = Math.round(this.scaleY(datum.reproduction_rate)) + 10;

        this.tooltipDynamic
            .attr("transform", `translate(${x},${y})`)
            .call(callout, `${formatDate2(new Date(datum.date))}`);
    }



    // check visibilty of the storytelling captions
    evaluateCaptions() {
        let { step, stepProgress, data } = this.props;

        console.log(step, stepProgress);
        
        this.showLineAt(0);
        this.tooltipDynamic.call(callout, null);

        // first date point?        
        if( step === 10 && _.inRange(stepProgress, 0, 0.22) )
            this.showTooltipDynamic(0);
        
        // 
        if( step === 10 && _.inRange(stepProgress, 0.22, 0.43) ) {
           this.showLineAt(2)
           this.showTooltipDynamic(2);
        }

        //
        if( step === 10 && _.inRange(stepProgress, 0.43, 0.65) ) {
            this.showLineAt(5)
            this.showTooltipDynamic(5);
        }

        //
        if( step === 10 && _.inRange(stepProgress, 0.65, 0.8) ) {
            this.showLineAt(13)
            this.showTooltipDynamic(13);
        }

        //
        if( step === 10 && _.inRange(stepProgress, 0.8, 0.9) ) {
            this.showLineAt(19)
            this.showTooltipDynamic(19);
        }

        //
        if( step === 10 && _.inRange(stepProgress, 0.91, 0.99) ) {
            this.showLineAt(data.length)
            this.showTooltipDynamic(data.length);
        }
    }


    showLineAt(n) {
        const { data } = this.props;

        const lineM = d3.line()
                .x(d => this.scaleX(d.mobility_change_from_baseline))
                .y(d => this.scaleY(d.reproduction_rate))
                .curve(d3.curveCardinalOpen),
            self = this;

        // show date points
        this.placeHolderDatePoints.selectAll('circle').remove();
        this.placeHolderDatePoints.selectAll('circle')
            .data(data.slice(0, Math.ceil(n+1)))
            .join('circle')
                .attr('class', 'date-points')
                .attr('cx', d => this.scaleX(d.mobility_change_from_baseline))
                .attr('cy', d => this.scaleY(d.reproduction_rate))
                .attr('r', 2)
                .attr('fill', 'rgb(99, 69, 180)')
                .style('cursor', 'pointer')
                .on("mouseenter", function(event) {
                    const pointer = d3.pointer(event, this);
                    const value = event.target.__data__;
    
                    self.tooltip
                        .attr("transform", `translate(${pointer[0]},${pointer[1] + 15})`)
                        .call(
                            callout, 
                            `${formatDate2(new Date(value.date))}`
                        );
                })
                .on("mouseleave", function() {
                    self.tooltip.call(callout, null);
                });

        this.pathB.attr(
            "d",
            lineM(
                [data[0]].concat(data).concat([data[data.length - 1]]).slice(0, 2 + Math.floor(n + 1))
            )
        );
        this.pathC.attr(
            "d",
            lineM(
                [data[0]].concat(data).concat([data[data.length - 1]]).slice(0, 2 + Math.ceil(n + 1))
            )
        );
        // We're using two paths drawn with a *curveCardinalOpen* on the same data with fake ends.
        // These paths are almost exactly superimposed with our *curveCardinal* path, so we can
        // measure them and interpolate!
        const lB = this.pathB.node().getTotalLength();
        const lC = this.pathC.node().getTotalLength();
        const l = lB + (lC - lB) * (n - Math.floor(n));

        // finally, apply a stroke-dasharray of the correct length
        this.timeLine.attr("stroke-dasharray", [l, this.timeLine.node().getTotalLength() - l]);        
     }



    createChart() {
        const size = this.elementRef.current.getBoundingClientRect();
        
        this.width = size.width;
        this.height = size.width * 0.75;
        this.margin = {top: 10, right:50, bottom: 180, left: 100};
                
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('overflow', 'visible');
        
        // add layers
        this.placeHolderContours = this.svg.append('g');
        this.placeHolderLine = this.svg.append('g');
        this.placeHolderDatePoints =  this.svg.append('g');
        this.tooltip = this.svg.append('g');
        this.tooltipDynamic = this.svg.append('g');

        // hidden paths to calculate distances to cut the correlation line
        this.pathB = this.svg.append("path");
        this.pathC = this.svg.append("path");
  
        [this.pathB, this.pathC].forEach(path => path
            .attr('class','fake-path')
            .attr("fill", "none")
            .attr("stroke", "none")
        );

        // Scales. Note on axis domains:
        // since we need smooth interpolations between contours, 
        // better to define fixed domains, so when new data appears
        // no new domain is set and our old contour does not move, just
        // transitions to the new one
        this.scaleX = d3.scaleLinear()
                        .domain(
                            [-100, 50]
                            /*d3.extent(data, d => d.mobility_change_from_baseline)
                                .map( (d,i) => {
                                    return i === 0? d:(d<10? 10:d)
                            })*/
                        )
                        .range([0 + this.margin.left, this.width - this.margin.right]);
        
        this.scaleY = d3.scaleLinear()
                        .domain([0, 3.5])
                        //([0, d3.max(data, d => d.reproduction_rate)])
                        .range([this.height - this.margin.bottom, this.margin.top]);
    }


    axisLabels(graph) {
        const { scaleX, scaleY } = this;

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


    updateChart(data, prevData) {
        
        let contoursFunc = d3.contourDensity()
                        .x(d => this.scaleX(d.mobility_change_from_baseline))
                        .y(d => this.scaleY(d.reproduction_rate))
                        .size([this.width, this.height])
                        .bandwidth(30)
                        //.thresholds(30),
                        // need to understand why these values are not greater ones
                        .thresholds(_.range(1, 30, 1).map(d => d/1000)),
            colors = ["whitesmoke","#4eeca3"],
            scaleColorLinear = d3.scaleLinear()
                .domain(d3.range(0,1,1/colors.length))
                .range(colors)
                .interpolate(d3.interpolateLab)
                .clamp(true),
            
            line = d3.line()
                    .x(d => this.scaleX(d.mobility_change_from_baseline))
                    .y(d => this.scaleY(d.reproduction_rate))
                    .curve(d3.curveCardinal.tension(0.5));

        // graph placeholder
        let graph = this.svg.append('g');

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
            .style("stroke-dasharray",[2, 2])
            .style("stroke-width", 1)
            .style("stroke", '#c0c0c0')//'#e8e8d7')
            .style('stroke-opacity', 1);

        const t = this.svg.transition().duration(750);
        
        // transition are going to be done through a single tween, 
        // so manually keep track of old/new data points, since
        // we will play with the weight values in the contours
        // nice idea from https://observablehq.com/@plmrry/animated-contours
        const allData = data
            .map(d => { return {...d, type:'enter'}})
            .concat(
                prevData? prevData.map(d => { return {...d, type:'exit'}; }) : []
            );

        // countours
        // Start a global transition
        d3.transition()
            .duration(1000)
            .tween("contours", d => {
                return tweenValue => {
                    const inverse = 1 - tweenValue;

                    // Set the weight accessor to return the tween value
                    // Entering points will gradually increase their effect on the contour generator.
                    // Exiting points will gradually decrease their effect on the contour generator.
                    contoursFunc.weight(d => d.type === "enter" ? tweenValue : inverse);

                    const contours = contoursFunc(allData);
                    
                    const threshold_domain = contours.map(d => d.value),
                        scaleColor = d3.scaleOrdinal()
                                .domain(contours.map(d => d.value))
                                .range(d3.quantize(scaleColorLinear, threshold_domain.length)),
                        contourPaths = this.placeHolderContours.selectAll("path.path-contour").data(contours);

                    contourPaths.exit().remove();
                    contourPaths
                        .enter()
                        .append("path")
                        .attr('class', 'path-contour')
                            .attr("stroke-width", 1)
                            .attr('stroke', 'whitesmoke')
                            //.style('mix-blend-mode','difference')
                            .attr("stroke-opacity", (d, i) => 1 - (i / 10) )
                            .attr('fill-opacity', 0.75)
                            .attr("fill", d => scaleColor(d.value))

                    contourPaths.attr("d", d3.geoPath());
                };
            });        

        // correlation line
        this.timeLine = this.placeHolderLine.append("path");
        let myLine = this.timeLine.datum(data)
                .attr("fill", "none")
                .attr("stroke", 'rgb(99, 69, 180)') //gradient)
                .attr('stroke-opacity',1)
                .attr("stroke-width", 2)
                .attr("d", line)
                .raise();
        myLine.clone()
            .attr('stroke-opacity', 0.5)
            .attr('stroke', 'whitesmoke')
            .attr("stroke-width", 6);
        myLine.raise();

        // axis, axis labels (once)
        if(_.isNil(prevData)) {
            this.axisLabels(graph);
                    // axis                 
            let yAxis = g => g.attr("transform", `translate(${this.margin.left},0)`)
                .call(d3.axisLeft(this.scaleY))
                .call( 
                    g => g.selectAll('*')
                    .attr('stroke-width', 0)
                    .attr('stroke', '#d0d0d0')
                );
            let xAxis = g => g.attr("transform", `translate(0,${this.height - this.margin.bottom})`)
                .call(d3.axisBottom(this.scaleX))
                .call( 
                    g => g.selectAll('*')
                        .attr('stroke-width', 0)
                        .attr('stroke', '#d0d0d0')
                );
            this.svg.append("g").call(xAxis);
            this.svg.append("g").call(yAxis);
        }
    }



    render() {
        return <div style={{maxWidth:"99%"}} ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
    }
}
export default MobilityVsReproductionRateChart;
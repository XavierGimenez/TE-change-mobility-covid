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
        
        if(prevProps.mobilityCategory !== this.props.mobilityCategory)
            this.updateChart(this.props.data, prevProps.data);

        if( prevProps.showTimeline !== this.props.showTimeline || 
            prevProps.mobilityCategory !== this.props.mobilityCategory)
            this.showTimeline(this.props.showTimeline, this.props.data);

        if(prevProps.step !== this.props.step) {
            this.evaluateCaptions();        
            this.showAnnotations();
        }
    }



    showTimeline(showTimeline, data) {

        let line = d3.line()
                .x(d => this.scaleX(d.mobility_change_from_baseline))
                .y(d => this.scaleY(d.reproduction_rate))
                .curve(d3.curveCardinal.tension(0.5)),
            self = this,
            l;

        this.placeHolderTimeline.selectAll('*').remove();
        this.placeHolderTimeline.attr('opacity', showTimeline? 1:0);
        this.placeHolderContours.attr('opacity', showTimeline? 0.5:1);
        if(showTimeline) {
            this.placeHolderTimeline
                .attr("stroke", 'white') //'#f6d912'
                .attr("stroke-width", 2)
                //.style('mix-blend-mode','lighten'); // or screen

          l = this.placeHolderTimeline
                .append("path")
                .datum(data)
                .attr("fill", "none")                
                .attr("stroke-dasharray", [1,3])
                .attr("stroke-width", 2)                
                .attr("d", line);

            l.clone()
                .attr('stroke-opacity', 0.2)
                .attr('stroke', 'whitesmoke')
                .attr('stroke-dasharray', null)
                .attr("stroke-width", 4);            
            l.raise();

            this.placeHolderTimeline.selectAll('circle')
                .data(data)
                .join('circle')
                    .attr('class', 'date-points')
                    .attr('cx', d => this.scaleX(d.mobility_change_from_baseline))
                    .attr('cy', d => this.scaleY(d.reproduction_rate))
                    .attr('r', d => d.date === _.first(data).date || d.date === _.last(data).date?  5 : 3)
                    .attr('stroke', '#122c91')
                    .attr('stroke-width', 2)
                    .attr('stroke-opacity', 0.7)
                    .attr('fill', 'whitesmoke')
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

            //drawArrowsThroughLine(l.node(), this.placeHolderTimeline);
        }
    }




    showTooltipDynamic(n) {
        const data = this.props.data.slice(0, Math.ceil(n+1)),
            datum = _.last(data);
        
        let x = this.scaleX(datum.mobility_change_from_baseline),
            y = Math.round(this.scaleY(datum.reproduction_rate)) + 10;

        let text;
        switch(n) {
            case 0:
                text = formatDate2(new Date(datum.date)) + 
                    "\nReproduction rate of " + datum.reproduction_rate + 
                    "\nNo lockdown applied yet. ";
                break;
            default:
                text=formatDate2(new Date(datum.date));
                break;
        }

        this.tooltipDynamic
            .attr("transform", `translate(${x},${y})`)
            .call(callout, `${text}`);
    }



    showAnnotations() {
        let { step } = this.props,
            g = this.placeHolderAnnotations;

        g.selectAll("*").remove();

        if(this.props.mobilityCategory !== "retail_and_recreation_percent_change_from_baseline")
            return;

        switch(step) {
            case 15: 
                g.append('text')
                    .attr('class', 'arrow')
                    .attr('x', this.scaleX(-40))
                    .attr('y', this.scaleY(2.57))
                    .text("←")                
                g.append('g')
                    .attr('transform', 'translate(' + this.scaleX(-40) + ',' + this.scaleY(2.5) + ')')
                    .append('text').attr('dy', 0)
                    .text("National lockdown reduces mobility to a minimum.")
                    .call(textWrap, 150);
                break;
            case 20: 
                g.append('text')
                    .attr('class', 'arrow')
                    .attr('x', this.scaleX(-80))
                    .attr('y', this.scaleY(1.5))
                    .text("↓")                
                g.append('g')
                    .attr('transform', 'translate(' + this.scaleX(-77) + ',' + this.scaleY(1.5) + ')')
                    .append('text').attr('dy', 0)
                    .text("Reproduction rate goes below 1 thanks to the reduction in mobility.")
                    .call(textWrap, 200);
                break; 
            case 30: 
                g.append('text')
                    .attr('class', 'arrow')
                    .attr('x', this.scaleX(-60))
                    .attr('y', this.scaleY(1.17))
                    .text("→")                
                g.append('g')
                    .attr('transform', 'translate(' + this.scaleX(-68) + ',' + this.scaleY(1.1) + ')')
                    .append('text').attr('dy', 0)
                    .text("Easing lockdown restrictions progressively, while keeping the R below 1.")
                    .call(textWrap, 200);
                break;
            case 40: 
                g.append('text')
                    .attr('class', 'arrow')
                    .attr('x', this.scaleX(1))
                    .attr('y', this.scaleY(1.5))
                    .text("↑")                
                g.append('g')
                    .attr('transform', 'translate(' + this.scaleX(4) + ',' + this.scaleY(1.5) + ')')
                    .append('text').attr('dy', 0)
                    .text("The 'new normality phase' triggers a resurgence in the spread.")
                    .call(textWrap, 175);
                break;      
            case 50: 
                g.append('text')
                    .attr('class', 'arrow')
                    .attr('x', this.scaleX(-35))
                    .attr('y', this.scaleY(1.4))
                    .text("←")                
                g.append('g')
                    .attr('transform', 'translate(' + this.scaleX(-37) + ',' + this.scaleY(1.6) + ')')
                    .append('text').attr('dy', 0)
                    .text("Partial lock-downs keep the reproduction rate to controllable levels.")
                    .call(textWrap, 160);
                break;
            case 60: 
                    g.append('text')
                        .attr('class', 'arrow')
                        .attr('x', this.scaleX(-35))
                        .attr('y', this.scaleY(1.75))
                        .text("↺")                
                    g.append('g')
                        .attr('transform', 'translate(' + this.scaleX(-40) + ',' + this.scaleY(1.9) + ')')
                        .append('text').attr('dy', 0)
                        .text("Back and forth of mobility restrictions and R around 1.")
                        .call(textWrap, 160);                    
                break;                                                                
        }
    }


    // check visibilty of the storytelling captions
    evaluateCaptions() {
        let { step, data } = this.props;

        this.showLineAt(0, 0);
        this.showLineAt(0, 0, this.timeLineClonedStepBefore);
        this.tooltipDynamic.call(callout, null);

        // decide progress of the timeline
        // date position through the line, keep also
        // track of the previous point so we can
        // highlight just the time span being described 
        let datePointIndex = (step === 10)? [0,0] : 
            (step === 15)? [2, 0] : 
            (step === 20)? [5, 2] : 
            (step === 30)? [13,5] :
            (step === 40)? [27,13] :  
            (step === 50)? [35,27] :  
            (step === 60)? [data.length,35] :  
            (step === 70)? [-1,-1]:[-1,-1]
        
        if(datePointIndex[0] !== -1 ) {
            this.showLineAt(datePointIndex[0], datePointIndex[1]);
            this.showTooltipDynamic(datePointIndex[0]);
            this.showLineAt(datePointIndex[1], datePointIndex[1], this.timeLineClonedStepBefore)
        }
        // steps visible?
        
        this.placeHolderTimeline.attr('opacity', step === 70? (this.props.showTimeline? 1:0) : 0);
        
        this.placeHolderDatePoints.attr('opacity', (step < 10 || step > 60)? 0:1);

        // last step?, hide timelines        
        this.placeHolderLine.attr('opacity', (step === 70)? 0:1);        

        // decide visibility of contours
        this.placeHolderContours.transition().duration(2000).attr('opacity', step >= 70? 1:0);
    }


    showLineAt(n, nPrevious, stepBefore = undefined) {
        const { data } = this.props;

        const lineM = d3.line()
                .x(d => this.scaleX(d.mobility_change_from_baseline))
                .y(d => this.scaleY(d.reproduction_rate))
                .curve(d3.curveCardinalOpen),
            self = this;

        // show date points
        if(_.isUndefined(stepBefore)) {
            this.placeHolderDatePoints.selectAll('circle').remove();
            this.placeHolderDatePoints.selectAll('circle')
                //.data(data.slice(Math.ceil(nPrevious+1), Math.ceil(n+1)))
                .data(data.slice(0, Math.ceil(n+1)))
                .join('circle')
                    .attr('class', 'date-points')
                    .attr('opacity', function(d,i) {
                        return _.inRange(i, nPrevious, n+1)? 1:0.5
                    })
                    .attr('cx', d => this.scaleX(d.mobility_change_from_baseline))
                    .attr('cy', d => this.scaleY(d.reproduction_rate))
                    .attr('r', 4)
                    .attr('stroke', '#122c91')
                    .attr('stroke-width', 3)
                    .attr('fill', 'whitesmoke')
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
        }        

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
        // https://observablehq.com/@fil/animated-cardinal-curve
        // We're using two paths drawn with a *curveCardinalOpen* on the same data with fake ends.
        // These paths are almost exactly superimposed with our *curveCardinal* path, so we can
        // measure them and interpolate!
        const lB = this.pathB.node().getTotalLength();
        const lC = this.pathC.node().getTotalLength();
        const l = (lB + (lC - lB) * (n - Math.floor(n)) ) * 0.98; // 0.xx because there is some extra offset in the totalLength...

        // finally, apply a stroke-dasharray of the correct length
        if(_.isUndefined(stepBefore)) {
            this.timeLine.attr("stroke-dasharray", [l, this.timeLine.node().getTotalLength() - l]);
            this.timeLineCloned.attr("stroke-dasharray", [l, this.timeLine.node().getTotalLength() - l]);
        }
        else {
            this.timeLineClonedStepBefore.attr("stroke-dasharray", [l, this.timeLine.node().getTotalLength() - l]);
        }        
     }



    createChart() {
        const size = this.elementRef.current.getBoundingClientRect();
        
        this.width = size.width;
        this.height = size.width * 0.75;
        this.margin = {top: 10, right:50, bottom: 180, left: 100};
                
        this.svg = d3.select(this.node)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('overflow', 'hidden');
        
        // add arrow marker
        this.markerBoxWidth = 4;
        this.markerBoxHeight = 4;
        this.refX = this.markerBoxWidth / 2;
        this.refY = this.markerBoxHeight / 2;
        this.markerWidth = this.markerBoxWidth / 2;
        this.markerHeight = this.markerBoxHeight / 2;

        this.svg
            .append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, this.markerBoxWidth, this.markerBoxHeight])
            .attr('refX', this.refX)
            .attr('refY', this.refY)
            .attr('markerWidth', this.markerBoxWidth)
            .attr('markerHeight', this.markerBoxHeight)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()([[0, 0], [0, this.markerBoxWidth], [this.markerBoxWidth, this.markerBoxWidth/2]]))
            .attr('stroke', '#ed8a0a');

        // add layers
        this.placeHolderContours = this.svg.append('g').attr('opacity', 0);
        this.placeHolderLine = this.svg.append('g').attr('class', 'placeholder-line').attr('opacity', 0);
        this.placeHolderDatePoints =  this.svg.append('g').attr('class', 'placeholder-date-points');
        this.tooltip = this.svg.append('g');
        this.tooltipDynamic = this.svg.append('g');
        this.placeHolderTimeline = this.svg.append('g').attr('class', 'placeholder-timeline');
        this.placeHolderAnnotations = this.svg.append('g').attr('class', 'placeholder-annotations')

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
                            [-90, 70]
                            /*d3.extent(data, d => d.mobility_change_from_baseline)
                                .map( (d,i) => {
                                    return i === 0? d:(d<10? 10:d)
                            })*/
                        )
                        .range([0 + this.margin.left, this.width - this.margin.right]);
        
        this.scaleY = d3.scaleLinear()
                        .domain([0.25, 3.5])
                        //([0, d3.max(data, d => d.reproduction_rate)])
                        .range([this.height - this.margin.bottom, this.margin.top]);
    }


    axisLabels(graph) {
        const { scaleX, scaleY } = this;
        
        // vertical axis
        let yAxisLabels = graph.append('g')
            .attr('class', 'axis-labels')
            .attr('transform', 'translate(' + this.margin.left/2 + ',' + scaleY(1) + ') rotate(-90) ');
        
        yAxisLabels.append('text')
            .attr('dy',0)
            .attr('y', -this.margin.left/4)
            .attr('font-weight', 'bold')
            .attr('class', 'axis-label-main')
            .style('text-anchor', 'middle')
            .text('Reproduction rate');

        yAxisLabels.append('text')
            .text('Increasing →')
            .style('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('x', 10)
            .attr('y', 0)
            .attr('font-size', 11)

        yAxisLabels.append('text')
            .text('← Decreasing')
            .style('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .attr('x', -10)
            .attr('y', 0)
            .attr('font-size', 11)

        // horizontal axis
        let xAxisLabels = graph.append('g')
            .attr('class', 'axis-labels')
            .attr('transform', 'translate(' + scaleX(0) + ',' + (this.height - this.margin.bottom) + ')');

        xAxisLabels.append('text')
            .attr('dy',0)
            .attr('y', this.margin.bottom/2.5)
            .attr('font-weight', 'bold')
            .attr('class', 'axis-label-main')
            .style('text-anchor', 'middle')
            .text('Weekly change in mobility (%)');

        xAxisLabels.append('text')
        .text('More mobility →')
        .style('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('x', 15)
        .attr('y', this.margin.bottom/4)

        xAxisLabels.append('text')
            .text('← Less mobility')
            .style('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .attr('x', -15)
            .attr('y', this.margin.bottom/4)
    }


    updateChart(data, prevData) {
        let contoursFunc = d3.contourDensity()
                        .x(d => this.scaleX(d.mobility_change_from_baseline))
                        .y(d => this.scaleY(d.reproduction_rate))
                        .size([this.width, this.height])
                        .bandwidth(31)
                        //.thresholds(30),
                        // need to understand why these values are not greater ones
                        .thresholds(_.range(1, 30, 1).map(d => d/1000)),
            //colors = ["whitesmoke","#4eeca3"],
            colors = ['#122c91', '#2a6fdb', '#48d6d2', '#81e9e6', '#fefcbf'],
            //colors = ['#492b7c', '#301551', '#ed8a0a', '#f6d912', '#fff29c'],
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
            .style("stroke-dasharray",[2, 4])
            .style("stroke-width", 1)
            .style("stroke", '#2a6fdb')//'#e8e8d7')
            .style('stroke-opacity', 0.5);
        
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
                            //.attr("stroke-opacity", (d, i) => 1 - (i / 10) )
                            .attr("stroke-opacity", (d, i) => (i / 10) )
                            .attr('fill-opacity', 0.75)
                            .attr("fill", d => scaleColor(d.value))

                    contourPaths.attr("d", d3.geoPath());
                };
            });        

        // correlation line
        this.placeHolderLine.selectAll('path').remove();
        this.timeLine = this.placeHolderLine.append("path");
        let myLine = this.timeLine.datum(data)
                .attr("fill", "none")
                .attr("stroke", 'rgb(99, 69, 180)') //gradient)
                .attr('stroke-opacity',1)
                .attr("stroke-width", 2)
                .attr("d", line)
                .raise();
        this.timeLineCloned = myLine.clone()
            .attr('stroke-opacity', 1)
            .attr('stroke', 'whitesmoke')
            .attr("stroke-width", 6);            
        myLine.raise();

        this.timeLineClonedStepBefore = this.timeLineCloned.clone()
            .attr('stroke-opacity', 0.7)
            .attr('stroke', '#122c91')
            .raise();

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
        return <div style={{maxWidth:"99%", borderRight:"1px solid rgba(42, 111, 219, 0.25)"}} ref={this.elementRef}>
            <svg ref={node => this.node = node}></svg>
        </div>
    }
}
export default MobilityVsReproductionRateChart;
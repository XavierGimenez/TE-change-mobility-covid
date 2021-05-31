import * as d3 from 'd3';
import * as _ from 'lodash';

export const textWrap = function(text, wrapWidth = 200, yAxisAdjustment = 0) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 1,
          lineHeight = 1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")) - yAxisAdjustment,
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", `${dy}em`);
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > wrapWidth) {
  
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", (lineNumber * lineHeight) + dy + "em").text(word);
        }
      }
    });
    return 0;
  }


export const callout = (g, value) => {
    if (!value) return g.style("display", "none");

       g
            .style("display", null)
            .style("pointer-events", "none")
            .style("font", "10px sans-serif")
            .raise();

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
                    .attr("y", (d, i) => `${i * 1.5}em`)
                    .style("font-weight", (_, i) => i ? null : "bold")
                    .text(d => d)
            );

        const { y, width: w, height: h } = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
}



export const ptsOnCurve = function(svgLine, numPoints, iStart = 0, iEnd = svgLine.getTotalLength()) {
    const start = Math.max(0, iStart),
        end = Math.min(iEnd, svgLine.getTotalLength());
    
    const lineLength = end - start,
        interval = numPoints === 1 ? 0 : lineLength / (numPoints - 1);
  
    return d3.range(numPoints).map(function(d) {
      var point = svgLine.getPointAtLength(start + d * interval);
      return [point.x, point.y];
    });
}



export const drawArrowsThroughLine = function(lineNode, placeholder) {
    let lineLength = lineNode.getTotalLength(),
        headSize = 4,
        pointAtLengthScale = d3.scaleLinear().domain([0,1]).range([0, lineLength]);
    
        
    d3.ticks(0.1, 0.9, 15).forEach(step => {
        let pointAtLength = pointAtLengthScale(step);
        let pointsOnLines = ptsOnCurve(lineNode, 3, (pointAtLength)-10, (pointAtLength)+10),
            len = pointsOnLines.length,
            middle = Math.floor(len / 2),
            [xa1, ya1] = pointsOnLines[middle],
            [xa2, ya2] = pointsOnLines[middle + 1],
            [xb1, yb1] = pointsOnLines[len - 2],
            [xb2, yb2] = pointsOnLines[len - 1];

        //alpha is the slope where the label will be displayed
        const alpha = Math.atan2(ya2 - ya1, xa2 - xa1),
            alphaDeg = (alpha * 360) / (2 * Math.PI);

        //beta is the slope where the label will be displayed
        const beta = Math.atan2(yb2 - yb1, xb2 - xb1),
            betaDeg = (beta * 360) / (2 * Math.PI);
        
        //let's create the arrow, translate to the point location + rotate depending on slope between next point and previous one
        const arrow = placeholder.append('g')
            .attr('transform',`rotate(${alphaDeg}) translate(0 ${headSize * 0}) rotate(${-alphaDeg})`);

        // draw arrow's head
        const arrowHead = arrow.append('g')
            .attr('stroke-linecap',"round")
            .attr('transform', `translate(${xb2} ${yb2}) rotate(${betaDeg}) `);

        arrowHead.append('line')
            .attr('x1', -headSize).attr('x2', 0)
            .attr('y1', +headSize).attr('y2', 0);

        arrowHead.append('line')
            .attr('x1', -headSize).attr('x2', 0)
            .attr('y1', -headSize).attr('y2', 0);
        
        /*arrowHead.append('line')
            .attr('x1', -headSize).attr('x2', -headSize)
            .attr('y1', -headSize).attr('y2', headSize);*/
    });
}


export const drawArrowHeadLines = function(lineNode, placeholder) {
    let lineLength = lineNode.getTotalLength(),
        pointAtLengthScale = d3.scaleLinear().domain([0,1]).range([0, lineLength]);
    
    d3.ticks(0.1, 0.9, 8).forEach(step => {
        let pointAtLength = pointAtLengthScale(step);
        let pointsOnLines = ptsOnCurve(lineNode, 5, (pointAtLength)-10, (pointAtLength)+10);

        placeholder.append('line')
            .attr('x2', _.first(pointsOnLines)[0])
            .attr('y2', _.first(pointsOnLines)[1])
            .attr('x1', _.last(pointsOnLines)[0])
            .attr('y1', _.last(pointsOnLines)[1])
            .attr('marker-start', 'url(#arrow)')
            .attr('stroke', '#ed8a0a')
            .attr('fill', '#ed8a0a')
    });
}

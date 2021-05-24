export const textWrap = (text, wrapWidth, yAxisAdjustment = 0) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")) - yAxisAdjustment,
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", `${dy}em`);
      while (word = words.pop()) {
        console.log(word)
        line.push(word);
        tspan.text(line.join(" "));
        console.log(tspan.text(), tspan.node().getComputedTextLength(), wrapWidth)
        if (tspan.node().getComputedTextLength() > wrapWidth) {
  
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
    return 0;
  }
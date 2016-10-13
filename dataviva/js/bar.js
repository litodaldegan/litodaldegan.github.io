$(function(){

    //Width and height
    var w = $(document).width() * 0.9,
        h = $(document).height() * 0.7;
        barPadding = 1;
        margin = {bottom: $(document).height() * 0.09, left: $(document).width() * 0.05}
    
    var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                    11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

    var svg = d3.select("div.bar")
                .append("svg")
                .attr("width", w + margin.left)
                .attr("height", h + margin.bottom);

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "Oi";
    })

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return (i * (w / dataset.length)) + margin.left;
        })
        .attr("y", function(d) {
            return h - (d * 4)
        })
        .attr("width", w /dataset.length - barPadding)
        .attr("height", function(d) {
            return d * 4;
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (d * 10) + ")";
        });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return i *
                    (w / dataset.length) + margin.left +
                    (w / dataset.length - barPadding) / 2;
        })
        .attr("y", function(d) {
            return h - (d * 4) + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
});
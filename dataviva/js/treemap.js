$(function(){
  // Occupation size of visualization
  var margin = {top: 40, right: 20, bottom: 20, left: 20},
      width = $(document).width() * 0.9 - margin.left - margin.right,
      height = $(document).height() * 0.6 - margin.top - margin.bottom;

  // Color category to be used
  var color = d3.scale.category20b();

  var treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function(d) { return d.size; });

  var div = d3.select("div.treemap").append("div")
      .style("position", "relative")
      .style("width", (width + margin.left + margin.right) + "px")
      .style("height", (height + margin.top + margin.bottom) + "px")
      .style("left", margin.left + "px")
      .style("top", margin.top + "px");

  // var tip = d3.tip()
  //   .attr('class', 'd3-tip')
  //   .offset([-10, 0])
  //   .html(function(d) {
  //       return "<div style='text-align: center'><strong>" + d.state + 
  //       "<br/><br/><strong>Average:</strong> <span style='color:red'>"
  //       + d.totalSalary + "</span>" + "<br/><br/><strong>Average age: "
  //       + "<span style='color:red'>" + d.avgAge;
  //   })

  d3.json("data/tree-map_data.json", function(error, root) {
    if (error) throw error;

    var node = div.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { return d.children ? color(d.name) : null; })
        .text(function(d) { return d.children ? null : d.name; });

    d3.selectAll("input").on("change", function change() {
      var value = this.value === "count"
          ? function() { return 1; }
          : function(d) { return d.size; };

      node
          .data(treemap.value(value).nodes)
        .transition()
          .duration(1500)
          .call(position);
    });
  });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }

});
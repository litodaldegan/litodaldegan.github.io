var margin = {top: 60, right: 20, bottom: 30, left: 70},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
.rangeRoundBands([0, width+20], .1);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(4)
.tickFormat(function(d){
  return parseInt(Math.abs(d)).toLocaleString("pt-BR");
});

var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
  return "<strong>Quantidade:</strong> <span style='color:red'>" + d.quantidade + "</span>";
})

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.tsv("data/vis2.csv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.estado; }));
  y.domain([0, d3.max(data, function(d) { return d.quantidade; })]);
  var minimo = d3.min(data, function(d) { return d.quantidade; });
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Quantidade");

  svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.estado); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.quantidade); })
  .attr("height", function(d) { return height - y(d.quantidade); })
  .attr("fill",function(d){
			return "rgb(" + (d3.round((d.quantidade / minimo) * 32)) + "," + (d3.round((d.quantidade / minimo) * 20)) + ",0)";
	  })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

  svg.append("text")
  .attr("x", (width / 2) - 30)
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("Soma do salário médio por estado em obras para Geração");

  svg.append("text")
  .attr("x", (width / 2) - 30)
  .attr("y", 20 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("e Distribuição de energia elétrica no Brasil");

  d3.select("#ordena").on("click", function(d){
    change("maiorMenor");
  });

  d3.select("#default").on("click", function(d){
    change("default");
  });

  var ordena = false;

  function change(ordenacao) {

    clearTimeout(1500);

    if(ordenacao === "maiorMenor"){
      ordena = !ordena;
      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(data.sort(ordena
        ? function(a, b) { return b.quantidade - a.quantidade; }
        : function(a, b) { return a.quantidade - b.quantidade;})
        .map(function(d) { return d.estado;}))
        .copy();
      }else if(ordenacao === "default"){
        var x0 = x.domain(data.sort(function(a, b) { return d3.ascending(a.estado, b.estado); })
        .map(function(d) { return d.estado;}))
        .copy();
      }

      svg.selectAll(".bar")
      .sort(function(a, b) { return x0(a.estado) - x0(b.estado); });

      var transition = svg.transition().duration(750),
      delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
      .delay(delay)
      .attr("x", function(d) { return x0(d.estado); });

      transition.select(".x.axis")
      .call(xAxis)
      .selectAll("g")
      .delay(delay);
    }

  });

  function type(d) {
    d.quantidade = +d.quantidade;
    return d;
  }

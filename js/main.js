	var margin = {top: 50, right: 30, bottom: 40, left: 30},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

		var x = d3.scale.linear()
		    .range([0, width]);

		// Espessura das barras
		var y = d3.scale.ordinal()
		    .rangeRoundBands([0, height], 0.12);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .ticks(13, ",.1s")
		    .tickSize(10, -3)
		    .tickFormat(function(d){
		    	return parseInt(Math.abs(d)).toLocaleString("pt-BR");
		    });

		// Alinhamento do texto de legenda de estado
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("right")
		    .tickSize(0)
		    .tickPadding(4);

		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.tsv("data/nEmpregados.csv", type, function(error, data) {
		  x.domain(d3.extent(data, function(d) { return d.quantidade; })).nice();
		  y.domain(data.map(function(d) { return d.estado; }));

		  // Barras do gr?ico
		  svg.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", function(d) { return "bar bar--" + (d.ligacao == "indireto" ? "negative" : "positive"); })
		      .attr("x", function(d) { return x(Math.min(0, d.quantidade)); })
		      .attr("y", function(d) { return y(d.estado); })
		      .attr("width", function(d) { return Math.abs(x(d.quantidade) - x(0)); })
		      .attr("height", y.rangeBand())
		      .attr("data-legend",function(d) { return d.ligacao});

		  // Legenda de valores (eixo x)
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  var minimo = d3.min(data, function(d) {return d.quantidade; });
		  console.log(minimo);

		  // Legenda do gr?ico (eixo y)
		  svg.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + x(minimo-8000) + ",0)")
		      .call(yAxis);
		
		  svg.append("g")
		    .attr("class","legend")
		    .attr("transform","translate(850,0)")
		    .style("font-size","14px")
		    .call(d3.legend);

		   svg.append("text")
	        .attr("x", (width / 2) - 30)             
	        .attr("y", 5 - (margin.top / 2))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "18px")
	        .style("font-weight", "bold")
	        .style("font-family", "sans-serif")   
	        .text("Comparativo de empregos diretamente vs indiretamente");

	        svg.append("text")
	        .attr("x", (width / 2) - 30)             
	        .attr("y", 25 - (margin.top / 2))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "18px") 
	        .style("font-weight", "bold")
	        .style("font-family", "sans-serif") 
	        .text(" ligados ao setor de energia elétrica no Brasil");
		});

		function type(d) {
		  d.quantidade = +d.quantidade;
		  return d;
		}

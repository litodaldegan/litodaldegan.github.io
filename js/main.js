"use strict";
		
		var margin = {top: 50, right: 30, bottom: 40, left: 30},
	    width = 780 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

		var x = d3.scale.linear()
		    .range([0, width]);

		// Espessura das barras
		var y = d3.scale.ordinal()
		    .rangeRoundBands([0, height], 0.10);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .ticks(13, ",.1s")
		    .tickSize(15, -3)
		    .tickFormat(function(d){
		    	return parseInt(Math.abs(d)).toLocaleString("pt-BR");
		    });

		// Alinhamento do texto de legenda de estado
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("right")
		    .tickSize(0)
		    .tickPadding(4);

		var svg = d3.select("#vis1")
			.append("div")
			.classed("svg-container", true)
			.append("svg")
			.classed("svg-content-responsive", true)
			.attr("preserveAspectRatio", "xMinYMin meet")
   			.attr("viewBox", "0 0 900 600")
		    //.attr("width", width + margin.left + margin.right)
		    //.attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.tsv("data/nEmpregados.csv", type, function(error, data) {
		  x.domain(d3.extent(data, function(d) { return d.quantidade; })).nice();
		  y.domain(data.map(function(d) { return d.estado; }));



		  // Barras do gráfico
		  svg.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", function(d) { return "bar bar--" + (d.ligacao == "indireto" ? "negative" : "positive"); })
		      .attr("x", function(d) { return x(Math.min(0, d.quantidade)); })
		      .attr("y", function(d) { return y(d.estado); })
		      .attr("width", function(d) { return Math.abs(x(d.quantidade) - x(0)); })
		      .attr("height", y.rangeBand())
		      .attr("data-legend",function(d) { return d.ligacao; });

		  // Legenda de valores (eixo x)
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  var minimo = d3.min(data, function(d) {return d.quantidade; });

		  // Legenda do gráfico (eixo y)
		  svg.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + x(minimo-8000) + ",0)")
		      .call(yAxis);
		
		  // Legenda
		  svg.append("g")
		    .attr("class","legend")
		    .attr("transform","translate(770,-30)")
		    .style("font-size","14px")
		    .call(d3.legend);


		//titulo do gráfico
		   svg.append("text")
	        .attr("x", (width / 2) - 30)             
	        .attr("y", 0 - (margin.top / 2))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "18px")
	        .style("font-weight", "bold")
	        .style("font-family", "sans-serif")   
	        .text("Comparativo de empregos diretamente vs indiretamente");

	        svg.append("text")
	        .attr("x", (width / 2) - 30)             
	        .attr("y", 20 - (margin.top / 2))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "18px") 
	        .style("font-weight", "bold")
	        .style("font-family", "sans-serif") 
	        .text(" ligados ao setor de energia elétrica no Brasil");
		});

		function type(d) {
		  d.quantidade = +d.quantidade;
		  d.totalempregados = +d.totalempregados;
		  return d;
		}


		$('#vis1-sorter').on('change', function(){

			var val = $(this).val();

			if (!$.trim(val)) {
				return;
			}

			var sort = val.split("_");

			var estados = [];

			svg
				.selectAll(".bar")
				.filter(function(d){
					if (sort[0] == "direto" || sort[0] == "indireto")
						return d.ligacao == sort[0];

					if (sort[0] == "tempregados")
						return d.totalempregados;

					return d.estado;
				})
				.sort(function(a, b) {
					if (sort[0] == "direto" || sort[0] == "indireto") {
						if (sort[1] == "asc")
							return d3.ascending(Math.abs(a.quantidade),Math.abs(b.quantidade));
						else
							return d3.descending(Math.abs(a.quantidade),Math.abs(b.quantidade));
					}

					if (sort[0] == "tempregados") {
						if (sort[1] == "asc")
							return d3.ascending(a.totalempregados,b.totalempregados);
						else
							return d3.descending(a.totalempregados,b.totalempregados);
					}

					return d3.ascending(a.estado, b.estado);
				})
				.each(function(d) {
					estados.push(d.estado);
				});

			// ordena o dominio y de estados pelo vetor construido anteriormente com os estados ordenados
			y.domain(estados);
			

			// atualiza posicoes das barras
			svg
				.selectAll(".bar")
				.transition()
				.attr("y", function(d,i) { return y(d.estado); });

			// atualiza posicoes das legendas
			svg
				.selectAll("g .y.axis")
        		.call(yAxis);

		});
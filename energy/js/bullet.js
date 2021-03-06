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

		var tip = d3.tip()
		    .attr('class', 'd3-tip')
		    .offset([-10, 0])
		    .html(function(d) {
		    	if (d.connection == "direct")
		        	return "<div style='text-align: center'><strong>" + d.state + "<br/><br/><strong>Direct:</strong> <span style='color:red'>" + d.amount + "</span>";
	    		else
	    			return "<div style='text-align: center'><strong>" + d.state + "<br/><br/><strong>Indirect:</strong> <span style='color:red'>" + (-d.amount) + "</span>";
	    })

		svg.call(tip);

		d3.tsv("data/statesData.csv", type, function(error, data) {
		  x.domain(d3.extent(data, function(d) { return d.amount; })).nice();
		  y.domain(data.map(function(d) { return d.state; }));



		  // Barras do gráfico
		  svg.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", function(d) { return "bar bar--" + (d.connection == "indirect" ? "negative" : "positive"); })
		      .attr("x", function(d) { return x(Math.min(0, d.amount)); })
		      .attr("y", function(d) { return y(d.state); })
		      .attr("width", function(d) { return Math.abs(x(d.amount) - x(0)); })
		      .attr("height", y.rangeBand())
		      .attr("data-legend",function(d) { return d.connection; })
		      .on('mouseover', tip.show)
        	  .on('mouseout', tip.hide);

		  // Legenda de valores (eixo x)
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  var minimo = d3.min(data, function(d) {return d.amount; });

		  // Legenda do gráfico (eixo y)
		  svg.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + x(minimo-710) + ",0)")
		      .call(yAxis);
		
		  // Legenda
		  svg.append("g")
		    .attr("class","legend")
		    .attr("transform","translate(770,-30)")
		    .style("font-size","16px")
		    .call(d3.legend);


		//titulo do gráfico
		   svg.append("text")
	        .attr("x", (width / 2) - 30)             
	        .attr("y", -10 - (margin.top / 2))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "20px")
	        .style("font-weight", "bold")
	        .style("font-family", "sans-serif")   
	        .text("Comparative of indirect employees vs direct employees (2009)");
	        /*Comparativo de empregos diretamente vs indiretamente*/

	        // svg.append("text")
	        // .attr("x", (width / 2) - 30)             
	        // .attr("y", 20 - (margin.top / 2))
	        // .attr("text-anchor", "middle")  
	        // .style("font-size", "18px") 
	        // .style("font-weight", "bold")
	        // .style("font-family", "sans-serif") 
	        // .text("for the electric energy sector in Brazil");
	        /* ligados ao setor de energia elétrica no Brasil*/
		});

		function type(d) {
		  d.amount = +d.amount;
		  d.totalEmployees = +d.totalEmployees;
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
					if (sort[0] == "direct" || sort[0] == "indirect")
						return d.connection == sort[0];

					if (sort[0] == "tempregados")
						return d.totalEmployees;

					return d.state;
				})
				.sort(function(a, b) {
					if (sort[0] == "direct" || sort[0] == "indirect") {
						if (sort[1] == "asc")
							return d3.ascending(Math.abs(a.amount),Math.abs(b.amount));
						else
							return d3.descending(Math.abs(a.amount),Math.abs(b.amount));
					}

					if (sort[0] == "tempregados") {
						if (sort[1] == "asc")
							return d3.ascending(a.totalEmployees,b.totalEmployees);
						else
							return d3.descending(a.totalEmployees,b.totalEmployees);
					}

					return d3.ascending(a.state, b.state);
				})
				.each(function(d) {
					estados.push(d.state);
				});

			// ordena o dominio y de estados pelo vetor construido anteriormente com os estados ordenados
			y.domain(estados);
			

			// atualiza posicoes das barras
			svg
				.selectAll(".bar")
				.transition()
				.attr("y", function(d,i) { return y(d.state); });

			// atualiza posicoes das legendas
			svg
				.selectAll("g .y.axis")
        		.call(yAxis);

		});
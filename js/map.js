$(function(){

	var globalStates;
	var globalData;
	var mapFilter = "indireto";
	var maxQtd = 0;
	var minQtd = 0;

	//definindo tamanho do svg
	var width = 900,
		height = 650;

	//projecao cartografica que vai gerar o mapa
	var projection = d3.geo.mercator()//existem outras
			.center([-55,-10])//centro do mapa, posicoes latitude e longitude brasil
			.scale(750)//tamanho do grafico apresentado na tela
		;
	//"lapis de desenhar" desenha o shape dos estados
	var path = d3.geo.path()
		.projection(projection)
		.pointRadius(2.5);//vai desenhar na tela de acordo com a projecao cartografica


	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(s) {

	  	var qtd = "";
	  	var estado = "";
		$.each(globalData, function(i, d){
					if (d.ligacao == mapFilter) {

						if (d.estado.toLowerCase() == s.properties.name.toLowerCase()) {
							qtd = Math.abs(d.quantidade);
							estado = d.estado;
						}
					}

				});
		if (estado)
			return "<div style='text-align: center'><strong>" + estado + "</strong></div><br/><strong>Empregados:</strong> <span style='color:red'>" + qtd + "</span>";
		else
			return "-";
	  });
	  svg.call(tip);


	function colorGen(s){
		var qtd = 0;
		//Identifica o estado correspondente para interpolar a cor
		$.each(globalData, function(i, d){
			if (d.ligacao == mapFilter) {
				if (d.estado.toLowerCase() == s.properties.name.toLowerCase()) {
					qtd = Math.abs(d.quantidade);
				}
			}

		});

		if (mapFilter == "direto")
	    	return d3.interpolateBlues( (qtd  - minQtd ) / maxQtd );
		else
			return d3.interpolateOranges( (qtd  - minQtd ) / maxQtd );
	}

	function findMax(){
		maxQtd = 0;
		$.each(globalData, function(i, d){

			if (d.ligacao == mapFilter) {

				var qtd = Math.abs(d.quantidade);
				if (qtd > maxQtd) {
					maxQtd = qtd;
				}
			}

		});
	}

	function findMin(){
		minQtd = Infinity;
		$.each(globalData, function(i, d){

			if (d.ligacao == mapFilter) {

				var qtd = Math.abs(d.quantidade);
				if (qtd < minQtd) {
					minQtd = qtd;
				}
			}

		});
	}

	queue()
		.defer(d3.json,"data/states.json")
		.defer(d3.tsv,"data/nEmpregados.csv")
		.await(function(error, states, data){
			
			globalData = data;
			globalStates = states;
			if(error) return console.error(error);

			//Identifica a quantidade máxima e minima da categoria
			findMax();
			findMin();

			console.log(states.features);
			d3
				.select("#mapa")
				.append("div")
				.classed("svg-container", true)
				.append("svg")
				.classed("svg-content-responsive", true)
				.attr("preserveAspectRatio", "xMinYMin meet")
   				.attr("viewBox", "0 0 900 600")
				.append("g")
				.attr("class","states")
				.selectAll("path")
				.data(states.features)
				.enter()
				.append("path")
				.style('fill', function(s){ return colorGen(s); })
				.attr("d",path)
				.attr("name",function(d) { return d.properties.name; })
				.on('mouseover', tip.show)
	      		.on('mouseout', tip.hide);

		});
	
	
		$("#mapa-filter").on('change', function(){

			mapFilter = $(this).val();
			
			//Identifica a quantidade máxima e minima da categoria
			findMax();
			findMin();

			d3
				.selectAll("#mapa .states path")
				.style('fill', function(s){ return colorGen(s); });

		});
});
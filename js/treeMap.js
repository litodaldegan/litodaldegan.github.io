$(function(){
	var tree = {
	name: "tree",
	children: [
		{name:	"Acré",	size:	730},
		{name:	"Amazonas",	size:	2907},
		{name:	"Amapá",	size:	298},
		{name:	"Pará",	size:	1738},
		{name:	"Rondônia",	size:	220},
		{name:	"Roraima",	size:	150},
		{name:	"Tocantins",	size:	844},
		{name:	"Alagoas",	size:	719},
		{name:	"Bahia",	size:	6807},
		{name:	"Ceará",	size:	2419},
		{name:	"Maranhão",	size:	1628},
		{name:	"Paraíba",	size:	2375},
		{name:	"Pernambuco",	size:	3447},
		{name:	"Piauí",	size:	1071},
		{name:	"Rio Grande do Norte",	size:	999},
		{name:	"Sergipe",	size:	756},
		{name:	"Distrito Federal",	size:	3616},
		{name:	"Goiás",	size:	3373},
		{name:	"Mato Grosso do Sul",	size:	1950},
		{name:	"Mato Grosso",	size:	2079},
		{name:	"Espírito Santo",	size:	3143},
		{name:	"Minas Gerais",	size:	22803},
		{name:	"Rio de Janeiro",	size:	12686},
		{name:	"São Paulo",	size:	42592},
		{name:	"Paraná",	size:	9819},
		{name:	"Rio Grande do Sul",	size:	9412},
		{name:	"Santa Catarina",	size:	6475}
	]};

	var tip = d3.tip()
		.attr('class', 'd3-tip')
	  	.html(function(s) {
	  		return 'teste';
			return "<div style='text-align: center'><strong>" + '1' + "</strong></div><br/><strong>Empregados:</strong> <span style='color:red'>" + '1' + "</span>";
	 	});

	var width = $("#vis3").parent().width() * 0.45,
	    	height = 370,
	    	color = d3.scale.linear().domain([0,40000]).range(["LightGray","darkblue"]),
	    	div = d3.select("#vis3")
	    		.append("div")
	       		.style("position", "relative");

	var treemap = d3.layout.treemap()
	    	.size([width, height])
	    	.sticky(true)
	    	.value(function(d) { return d.size; });
	 
	var node = div.datum(tree).selectAll(".node")
	      	.data(treemap.nodes)
		.enter().append("div")
	      	.attr("class", "node")
	      	.attr("data-toggle", "tooltip")
	      	.attr("data-placement", "top")
	      	.attr("data-title",function(d) {
	      		return d.size + " students in " + d.name;
	      	})
	      	.attr("data-state", function(d){
	      		return d.name;
	      	})
	      	.call(position)
	      	.style("background-color", function(d) {
	          	return d.size == 'tree' ? '#fff' : color(d.size); })
	      .append('div')
	      .style("font-size", function(d) {
	          // compute font size based on sqrt(area)
	          return Math.max(8, 0.15*Math.sqrt(d.area))+'px'; })
	      .text(function(d) { return d.children ? null : (d.name + ", " + d.size); })
	      
	      $('#vis3 .node').tooltip();

	function position() {
	  	this.style("left", function(d) { return d.x + "px"; })
	      	.style("top", function(d) { return d.y + "px"; })
	      	.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	      	.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}

});

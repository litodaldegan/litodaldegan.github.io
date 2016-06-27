$(function(){
	var tree = {
	name: "tree",
	children: [
		{name:	"AL",	size:	5638	},
		{name:	"AC",	size:	1775	},
		{name:	"AM",	size:	10878	},
		{name:	"AP",	size:	992	},
		{name:	"PA",	size:	6816	},
		{name:	"RO",	size:	1033	},
		{name:	"RR",	size:	348	},
		{name:	"TO",	size:	2275	},
		{name:	"AL",	size:	3028	},
		{name:	"BA",	size:	24811	},
		{name:	"CE",	size:	8385	},
		{name:	"MA",	size:	5879	},
		{name:	"PB",	size:	9301	},
		{name:	"PE",	size:	12005	},
		{name:	"PI",	size:	2931	},
		{name:	"RN",	size:	3701	},
		{name:	"SE",	size:	2736	},
		{name:	"DF",	size:	11904	},
		{name:	"GO",	size:	12855	},
		{name:	"MS",	size:	5814	},
		{name:	"MT",	size:	6744	},
		{name:	"ES",	size:	12654	},
		{name:	"MG",	size:	87769	},
		{name:	"RJ",	size:	53284 },
		{name:	"SP",	size:	172967	},
		{name:	"PR",	size:	37027	},
		{name:	"RS",	size:	39762	},
		{name:	"SC",	size:	25635	}
	]};

	var tip = d3.tip()
		.attr('class', 'd3-tip')
	  	.html(function(s) {
	  		return 'teste';
			return "<div style='text-align: center'><strong>" + '1' + "</strong></div><br/><strong>Empregados:</strong> <span style='color:red'>" + '1' + "</span>";
	 	});

	var width = $("#vis3").parent().width() * 0.45,
	    	height = 600,
	    	color = d3.scale.linear().domain([0,190000]).range(["LightGray","darkblue"]),
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
	      		return d.size + " estudantes em " + d.name;
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

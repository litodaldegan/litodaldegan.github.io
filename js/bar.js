$(function(){

    var margin = {top: 30, right: 20, bottom: 30, left: 70},
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
        return "<strong>Amount:</strong> <span style='color:red'>" + d.totalSalary + "</span>";
    })


    svg.call(tip);

    d3.tsv("data/statesData.csv", type, function(error, data) {
        x.domain(data.map(function(d) { 
            if (d.connection == "direct")
                return d.initials; 
        }));
        y.domain([0, d3.max(data, function(d) { 
            if (d.connection == "direct")
                return d.totalSalary; 
        }) + 1000000]);
        var minimo = d3.min(data, function(d) { 
            if (d.connection == "direct")
                return d.totalSalary; });

        var svg = 
        d3
        .select("#vis2")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .classed("svg-content-responsive", true)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 900 600");

        svg.append("g")
        .append("g")
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
        .text("Amount");

        svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.initials); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.totalSalary); })
        .attr("height", function(d) { return height - y(d.totalSalary); })
        .attr("fill",function(d){
            return "rgb(" + (d3.round((d.totalSalary / minimo) * 32)) + "," + (d3.round((d.totalSalary / minimo) * 20)) + ",0)";
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

        svg.append("text")
        .attr("x", (width / 2) - 30)
        .attr("y",20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("Sum of average salary per state in construction for generation");
        // Soma do salário médio por estado em obras para Geração

        svg.append("text")
        .attr("x", (width / 2) - 30)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("and distribution of electric energy in Brazil");
        // e Distribuição de energia elétrica no Brasil

        d3.select("#ordena").on("click", function(d){
            change("maiorMenor");
        });

        $('#vis1-sorter').on('change', function(d){
            var val = $(this).val();
            var sort = val.split("_");

            if (sort[1] == "alf")
                change("default");
            else {
                if (sort[0] == "direct"){
                    if (sort[1] == "asc"){
                        change("maiorMenor");
                        change("maiorMenor");
                    }
                    else
                        change("maiorMenor");}
                }
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
                ? function(a, b) { return b.totalSalary - a.totalSalary; }
                : function(a, b) { return a.totalSalary - b.totalSalary; })
                .map(function(d) { return d.initials;}))
                .copy();
            }else if(ordenacao === "default"){
                var x0 = x.domain(data.sort(function(a, b) { return d3.ascending(a.initials, b.initials); })
                    .map(function(d) { return d.initials;}))
                .copy();
            }

    svg.selectAll(".bar")
    .sort(function(a, b) { return x0(a.initials) - x0(b.initials); });

    var transition = svg.transition().duration(750),
    delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
    .delay(delay)
    .attr("x", function(d) { return x0(d.initials); });

    transition.select(".x.axis")
    .call(xAxis)
    .selectAll("g")
    .delay(delay);
    }

    });

    function type(d) {
        d.totalSalary = +d.totalSalary;
        return d;
    }


});
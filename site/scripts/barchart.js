var barchart = {}
	;

barchart.create = function create(data, $div) {
	barchart.addFilters(data, $div);
	barchart.data = data;
	barchart.div = $div;
};

barchart.addFilters = function addFilters(data, $div) {
	$div.find('#chart-filters').append(barchart.addFilter('Select x axis indicator', 'barchart-x'));

	barchart.x = $('#barchart-x');
	var options = data.fields.map(field => {
			return '<option value="' + field.name + '">' + field.name + '</option>';
		}).join('');
	barchart.x.append(options);
	barchart.x.on('change', barchart.refreshChart);
};

barchart.refreshChart = function refreshChart() {
	if (!barchart.div || !barchart.x.val() || !barchart.div.find('svg.chart')) {
		return;
	}

	barchart.div.find('svg.chart').empty();

	var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.range([0, width])
	 	.padding(0.1)
	 	.round(true)
	    ;

	var y = d3.scaleLinear()
	    .range([height, 0]);

   	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var xAxis = d3.axisBottom(x);

	var yAxis = d3.axisLeft(y);

	var chart = d3.select("svg.chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var data = barchart.generateData();
	console.log(data)
   	x.domain(data.map(function(d) { return d.x_value; }));
  	y.domain([0, d3.max(data, function(d) { return d.y_value; })]);

  	chart.append("g")
      	.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
      	.call(xAxis);

  	chart.append("g")
      	.attr("class", "y axis")
      	.call(yAxis);

  	chart.selectAll(".bar")
      	.data(data)
    	.enter()
    		.append("rect")
		      	.attr("class", "bar")
		      	.attr("x", function(d) { return x(d.x_value); })
		      	.attr("y", function(d) { return y(d.y_value); })
		      	.attr("height", function(d) { return height - y(d.y_value); })
		      	.attr("fill", function(d) { return color(d.x_value); })
		      	.attr("width", x.bandwidth());
}

barchart.generateData = function generateData() {
	var x_domain = barchart.x.val()
		results = {};
		console.log(barchart.data.results)
	barchart.data.results
		.forEach(entry => {
			if (entry[x_domain] === null) {
				if (barchart.) {
					
				}
				entry[x_domain] = 'Not defined';
			}
			if (!results[entry[x_domain]]) {
				results[entry[x_domain]] = {
					count: 0
				}
			}
			results[entry[x_domain]].count += 1;
		});
	return Object.keys(results)
		.map(entry => {
			return {
				x_value: entry
				, y_value: results[entry].count
			}
		})
		.sort((a,b)  => {
			return b.y_value - a.y_value;
		});
}

barchart.addFilter = function addFilter(title, selector) {
	return '<label for="' + selector + '">' + title 
		+ '</label><div class="input-group"><span class="input-group-btn"></span><select id="' 
		+ selector + '"></select>';
};

module.exports = barchart;
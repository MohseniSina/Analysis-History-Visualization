

var svg = d3.select("#chartDiv").append("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 60};
	
	svg.attr("width", "1820");
	svg.attr("height", "500");

var width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,    
	chart_svg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataXRange = {min: 00, max: 6000};

var x_scale = d3.scaleLinear()
    .domain([dataXRange.min, dataXRange.max])
    .range([0, width]);

var y_scale = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x_scale);

var yAxis = d3.axisLeft(y_scale);

var circles;

// var yGroup = chart_svg.append("g");

var xGroup = chart_svg.append("g")
    .attr("transform", "translate(0," + height + ")");

var zoom = d3.zoom()
    .scaleExtent([1, 20])
    .translateExtent([[0, -Infinity], [width, Infinity]])
    .on("zoom", zoomed);

var zoomRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .call(zoom);

d3.json("data/Dataset_1/Topic_Events_Provenance/Arms_P1_timetopics_3.json", function(jsondata) {
	
	circles = chart_svg.append("g").attr("class","datapoint").selectAll(".datapoint").data(jsondata).enter()
	.append("circle").attr("class","datapoints")
	.attr("cx", function(d){return x_scale(d.Time);})
	.attr("cy", function(d){return d.Duration;})
	.attr("r", 10);
	
	zoom;
	// return jsondata;
}
	// function(error, data){
	  // if (error) throw error;
	  // var xExtent = d3.extent(data, function(d) { return d.Time; });
	  // zoom.translateExtent([[x(xExtent[0]), -Infinity], [x(xExtent[1]), Infinity]])
	  // y.domain([0, d3.max(data, function(d) { return d.Duration; })]);
	  // yGroup.call(yAxis).select(".domain").remove();
						 
	  // zoomRect.call(zoom.transform, d3.zoomIdentity);
	// }

);

function zoomed() {
  var xz = d3.event.transform.rescaleX(x_scale);
  xGroup.call(xAxis.scale(xz));
  d3.selectAll(".datapoints").attr("cx", function(d){return xz(d.Time); });
  // d3.selectAll(".datapoints").attr("cy", function(d){ return xz(d.Duration); });
}
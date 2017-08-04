var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
d3.select(window).on('resize.updatesvg', updateWindow);

var svg = d3.select("#chartDiv").append("svg"),
    margin = {top: 20, right: 60, bottom: 20, left: 60};
	
	svg.attr("width", "1820");
	svg.attr("height", "500");
	svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,    
	chart_svg = svg.append("g").attr("class","svg_chart");   //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var R_dataPoints = 10;
var Axis_room = 20;

var dataXRange = {min: 0, max: 6000};
var dataYRange = {min: 0, max: 10};

var x_scale = d3.scaleLinear()
    .domain([dataXRange.min, dataXRange.max])
    .range([0 + R_dataPoints, width - R_dataPoints]);

var y_scale = d3.scaleLinear()
	.domain([dataYRange.min, dataYRange.max])
    .range([height - 100, 0 + R_dataPoints]);

var xAxis = d3.axisBottom(x_scale);

var yAxis = d3.axisLeft(y_scale);

var circles;

var yGroup = svg.append("g");

var xGroup = svg.append("g").attr("transform", "translate(0," + height + ")");

var zoom = d3.zoom()
    .scaleExtent([1.2, 20])
    .translateExtent([[0, -Infinity], [width, Infinity]])
    .on("zoom", zoomed);

var zoomRect = svg.append("rect")
	.attr("class","zoom_rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .call(zoom);

d3.json("data/Dataset_1/Topic_Events_Provenance/Arms_P1_timetopics_3.json", function(jsondata) {
	
	circles = chart_svg.append("g").attr("class","datapoint").selectAll(".datapoint").data(jsondata).enter()
	.append("circle").attr("class","datapoints")
	.attr("cx", function(d){return x_scale(d.Time);})
	.attr("cy", function(d){return y_scale(d.Duration);})
	.attr("r", R_dataPoints);
	//.attr("transform", "translate(0, -20 )");  //R_dataPoints
	  
	  dataXRange.min = 0 // d3.min(jsondata, function(d) { return d.Time; })
	  dataXRange.max = d3.max(jsondata, function(d) { return d.Time; }) * 1.1;
	  
      dataYRange.min = d3.min(jsondata, function(d) { return d.Duration; })
	  dataYRange.max = d3.max(jsondata, function(d) { return d.Duration; })
	  dataYRange.max = 100
	  
	  updateWindow()
});

function updateWindow(){
							 
		zoomRect.call(zoom.transform, d3.zoomIdentity);
	  
		var chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth;
		var chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight;
		
		margin.bottom = (1/3) * chart_y;
		
		width = chart_x - margin.left - margin.right;
		height = chart_y - margin.top - margin.bottom;    
		
		zoom.translateExtent([[0, -Infinity], [width, Infinity]])
	
		svg.attr("width", width);
		svg.attr("height", height);
		svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		x_scale.domain([dataXRange.min, dataXRange.max]).range([0, width]);
		y_scale.domain([dataYRange.min, dataYRange.max]).range([height - R_dataPoints - Axis_room, 0]);
		
		xGroup.call(xAxis.scale(x_scale)).attr("transform", "translate(0," + (height - Axis_room) + ")");
		// yGroup.call(xAxis.scale(x_scale))
		
		chart_svg.selectAll(".datapoints").attr("cx", function(d){return x_scale(d.Time); });
		chart_svg.selectAll(".datapoints").attr("cy", function(d){return y_scale(d.Duration); });
		
		svg.selectAll(".zoom_rect").attr("width", width );
		svg.selectAll(".zoom_rect").attr("height", height );
		
		// svg.selectAll(".zoom_rect").moveToBack();
	}
	
function zoomed() {
  var xz = d3.event.transform.rescaleX(x_scale);
  xGroup.call(xAxis.scale(xz));
  chart_svg.selectAll(".datapoints").attr("cx", function(d){return xz(d.Time); });
  // d3.selectAll(".datapoints").attr("cy", function(d){ return xz(d.Duration); });
}
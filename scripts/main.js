
var time_weight = 100, topic_weight = 0, action_weight = 50;

// var topic_distance;
var colors = d3.scaleOrdinal(d3.schemeCategory10); 

var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
d3.select(window).on('resize.updatesvg', updateWindow);

var svg = d3.select("#chartDiv").append("svg"),
    margin = {top: 20, right: 60, bottom: 20, left: 60};
	
	svg.attr("width", "1820");
	svg.attr("height", "1000");
	svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,    
	chart_svg = svg.append("g").attr("class","svg_chart");   //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var points_size = 10;
var Axis_room = 20;

var dataXRange = {min: 0, max: 6000};
var dataYRange = {min: 0, max: 100};

var x_scale = d3.scaleLinear()
    .domain([dataXRange.min, dataXRange.max])
    .range([0 + points_size, width - points_size]);

var y_scale = d3.scaleLinear()
	.domain([dataYRange.min, dataYRange.max])
    .range([height - dataYRange.max, 0 + points_size]);

var xAxis = d3.axisBottom(x_scale);

//  var yAxis = d3.axisLeft(y_scale);

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
	
d3.select("#time_weight_slider").on("input", function() {
	time_weight = +this.value;
   	distanceFunction();
});

d3.select("#topic_weight_slider").on("input", function() {
	topic_weight = +this.value;
   	distanceFunction();
});

d3.select("#action_weight_slider").on("input", function() {
	action_weight = +this.value;
   	distanceFunction();
});

d3.json("data/Dataset_1/Topic_Events_Provenance/Arms_P8_timetopics_3.json", function(jsondata) {
	
	dataXRange.min = 0 
	dataXRange.max = d3.max(jsondata, function(d) { return d.Time; }) * 1.1;
  
	dataYRange.min = d3.min(jsondata, function(d) { return d.Duration; })
	dataYRange.max = d3.max(jsondata, function(d) { return d.Duration; })
	
	
	circles = chart_svg.append("g").attr("class","datapoint").selectAll(".datapoint").data(jsondata).enter()
		.append("circle").attr("class","datapoints")
		.attr("cx", function(d){return x_scale(d.Time);})
		.attr("cy", function(d){return y_scale(d.Duration);})
		.attr("r",function(d){
			// var temp = points_size * (1 + (d.Duration)/100);   // .toFixed()   // dataYRange.min
			return points_size;
			})	
		.style("fill-opacity",  function(d){
			// var temp = 1 - 10 * (d.Duration/dataYRange.max);   // .toFixed()
			return 0.5;
			});
			
	// interaction_data = jsondata;
	topicDistance(jsondata);     // comment  
	
	distanceFunction();     // define distance value for datapoints 
	  

		//dataYRange.max = 100
	  
	updateWindow()
});

function topicDistance(input){
	
	var topic_distance = [];
	var j = 0;
	
	input.forEach(function(d,i){
			
			temp = [0,0,0,0,0,0,0,0,0,0];
			var temp2;
			var temp3;	
			var temp4;
			
			
			
		if ((d.InteractionType == "search") | (d.InteractionType == "open_document") | (d.InteractionType == "reading_document") | (d.InteractionType == "highlight") | (d.InteractionType == "writing_notes") ) {   // find the topic change event times
			
			for (var ii=0; ii<d.ClassNum.length; ii++){
				temp2 = d.ClassNum[0]
				temp[temp2[0]-1] = temp2[1];
			}
			
			
			topic_distance.push(temp);
			
			if (j>0){   	// All datapoints
			
				var temp4 = topic_distance[j-1]
				var sub = temp4.map(function (num, idx) {    // temp3 = temp - topic_distance[i-1]
					return num - temp[idx];
				});
				
				var pow = sub.map(function (num, idx) {
					return num * sub[idx]; //return 1 * Math.abs(sub[idx]);
				});
				
				var sum = pow.reduce(function(a, b) { return a + b; }, 0);
				
				d.distance = Math.sqrt(sum);
				
				console.log("sqrt: ", d.distance, d.InteractionType, d.Time) //, "sum: ", sum,"sub: ", sub, "pow: ", pow)
				
			}else{    // First datapoint
				d.distance = 0
			}
			
			j += 1;

		}else{      // If not from mentioned user interactions 
				d.distance = 0
		}
	});
	
}
		// a function to define data points based on user defined time, topic and action weights.
function distanceFunction(){    
	console.log(time_weight, topic_weight, action_weight)
	var temp_topic = 0;
	var temp_time = 0;
	var temp_color = 0
	var k = 1;
	var temp_dur;
	dataXRange.max = 0;
	
	chart_svg.selectAll(".datapoints")
			.attr("cx", function(d,i){
				if (time_weight > 0){
					if (d.distance < 0.3){//if ((topic_weight * d.distance) < 20) {
					d.distance = 0
					}
					d.x_distance = (((d.Time - temp_time) * time_weight) / 100) + (topic_weight * k * d.distance);
				}else{
					// if (d.distance < 1) {d.distance = 0}
					if (d.distance < 2){//if ((topic_weight * d.distance) < 20) {
					d.distance = 0
					d.x_distance = topic_weight * k * d.distance;
					}else{
					d.x_distance = topic_weight * k * d.distance;
					}
				}
				d.x_distance += temp_topic;
				temp_topic = d.x_distance; // topic_weight * k * (d.distance);   // d.x_distance
				temp_time = d.Time;
				
				if (dataXRange.max < d.x_distance){dataXRange.max = d.x_distance;}
				
				return x_scale(d.x_distance); 
				})
			.attr("cy", function(d){
				// if (d.distance == 0){
					temp_dur = Math.floor(Math.random() * (500 - 10 + 1)) + 10
				// }
				d.y_distance = (temp_dur * action_weight) / 50
				
				if (dataYRange.max < d.y_distance){dataYRange.max = d.y_distance;}
				
				return y_scale(d.y_distance); 
				})
			.style("fill", function(d){
				// var temp = (d.Time/500).toFixed();
				if (d.distance == 0){
					// d.color = colors(temp_color)
					// return d.color;
					return colors(temp_color);
				}else{
					temp_color += 1;
					return "none";
				}					
				
				})
			.style("stroke",function(d){
				if (d.distance == 0){
					if (d.Duration < 2){
					return "red"
					}else{
					return "black"
					}
				}else{				
				return "green"; // d.color;
				}
				
				});
			
		x_scale.domain([dataXRange.min, dataXRange.max]).range([0, width]);
		y_scale.domain([dataYRange.min, dataYRange.max]).range([height - points_size - Axis_room, 0]);
		
		xGroup.call(xAxis.scale(x_scale)).attr("transform", "translate(0," + (height - Axis_room) + ")");
		
		chart_svg.selectAll(".datapoints").attr("cx", function(d){return x_scale(d.x_distance); });
		chart_svg.selectAll(".datapoints").attr("cy", function(d){return y_scale(d.y_distance); });
				
}
		
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
		y_scale.domain([dataYRange.min, dataYRange.max]).range([height - points_size - Axis_room, 0]);
		
		xGroup.call(xAxis.scale(x_scale)).attr("transform", "translate(0," + (height - Axis_room) + ")");
		
		chart_svg.selectAll(".datapoints").attr("cx", function(d){return x_scale(d.x_distance); });
		chart_svg.selectAll(".datapoints").attr("cy", function(d){return y_scale(d.y_distance); });
		
		svg.selectAll(".zoom_rect").attr("width", width );
		svg.selectAll(".zoom_rect").attr("height", height );
		
	}
	
function zoomed() {
  var xz = d3.event.transform.rescaleX(x_scale);
  xGroup.call(xAxis.scale(xz));
  chart_svg.selectAll(".datapoints").attr("cx", function(d){return xz(d.x_distance); });
  // d3.selectAll(".datapoints").attr("cy", function(d){ return xz(d.Duration); });
}
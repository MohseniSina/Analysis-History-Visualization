var hidRect;
var time_weight = 100, topic_weight = 0, action_weight = 400, cluster_weight = 20;
var max_y = 800;
var each_time_sec;
// var topic_distance;
var colors = d3.scaleOrdinal(d3.schemeCategory10); 

var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
d3.select(window).on('resize.updatesvg', updateWindow);

var svg = d3.select("#chartDiv").append("svg"),
    margin = {top: 20, right: 40, bottom: 20, left: 40};
	
	svg.attr("width", "1820");
	svg.attr("height", "1000");
	svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,    
	chart_svg = svg.append("g").attr("class","svg_chart"); // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var points_size = 10;
var Axis_room = 50;

var dataXRange = {min: 0, max: 6000};
var dataYRange = {min: 0, max: max_y};

var x_scale = d3.scaleLinear()
    .domain([dataXRange.min, dataXRange.max])
    .range([margin.left + points_size, width - points_size]);

var y_scale = d3.scaleLinear()
	.domain([dataYRange.min, dataYRange.max])
    .range([height - dataYRange.max, 0 + points_size]);

// var xAxis = d3.axisBottom(x_scale);

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

d3.select("#clustering_ratio_slider").on("input", function() {
	cluster_weight = +this.value;
   	distanceFunction();
});

    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
  
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  
d3.json("data/Dataset_1/Topic_Events_Provenance/Arms_P8_timetopics_3.json", function(jsondata) {
	
	dataXRange.min = 0 
	dataXRange.max = d3.max(jsondata, function(d) { return d.Time; }) * 1.1;
  
	dataYRange.min = d3.min(jsondata, function(d) { return d.Duration; })
	dataYRange.max = d3.max(jsondata, function(d) { return d.Duration; })


	dur_max = d3.max(jsondata, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 0;} })
	dur_min = d3.min(jsondata, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 1000;} })
		
	var json_length = Object.keys(jsondata).length;

	console.log("length: ",  json_length)
	
	circles = chart_svg.append("g").attr("class","datapoint").selectAll(".datapoint").data(jsondata).enter()
		.append("circle").attr("class","datapoints")
		.attr("cx", function(d){return x_scale(d.Time);})
		.attr("cy", function(d){
			if ((d.InteractionType == "highlight") | (d.InteractionType == "bookmark_highlights") | (d.InteractionType == "create_note") | (d.InteractionType == "writing_notes") | (d.InteractionType == "connection")) {
				d.y_distance = Math.floor(Math.random() * (max_y - (2*max_y)/3 + 1)) + (2*max_y)/3;
			}else{ 
				d.y_distance = Math.floor(Math.random() * (max_y/3 - 10 + 1)) + 10
			}  
			return y_scale(d.y_distance); 
				})
		.attr("r",function(d){
			// var temp = points_size * (1 + (d.Duration)/100);   // .toFixed()   // dataYRange.min
			if ((d.InteractionType == "open_document")) {
				return 2*points_size/3;
			}else if (d.InteractionType == "reading_document"){
				return ( points_size * (0.5 + (d.Duration * dur_min/dur_max) )  ) ;
			}else if ( (d.InteractionType == "brush_document_title") | (d.InteractionType == "moving_document") ) {
				return points_size / 4;
			}else{
				return points_size / 3;
			}

			
			})
		.style("stroke",function(d){
				if ((d.InteractionType == "open_document")) {
					return "black";
				}
				else if (d.InteractionType == "reading_document"){
					return "none";	
				}else{
					return "black";	
				}				
			})
		.style("fill-opacity",  function(d){
			// var temp = 1 - 10 * (d.Duration/dataYRange.max);   // .toFixed()
			if ((d.InteractionType == "open_document")) {
				return 0.2;	
			}
			else if (d.InteractionType == "reading_document"){
				return 0.5;	
			}else{
				return 1;	
			}
			
			});
			
	hidRect = svg.append("rect")
		.attr("class","hide_rect")
		.attr("width", width)
		.attr("height", 2)
		.attr("fill", "black")
		.attr("x", 0) 
		.attr("y", height)
		// .attr("transform", "translate(0," + height + ")");
	
	each_time_sec = dataXRange.max / 20;
	var counter = 0

	timeBox = chart_svg.append("g").attr("class","time_box").selectAll(".time_box").data(jsondata).enter()
		.append("rect").attr("class","time_boxs")
		.each(function(d){
			
  			if (d.Time < each_time_sec*counter) {   
				d3.select(this).remove();
			}else{
				counter += 1;
			}
		})
		.attr("width", 2)
    	.attr("height", 10)
    	.attr("fill", "red")
    	// .attr("transform", "translate(" + d.Time + " ," + height + ")");
    	.attr("x", function(d){return x_scale(d.Time);}) 
		.attr("y", height)
		
	// svg.selectAll(".time_boxs").moveToFront();
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
				d.topic = temp.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) + 1;
				
				// console.log("sqrt: ", d.distance, d.InteractionType, d.Time) //, "sum: ", sum,"sub: ", sub, "pow: ", pow)
				
			}else{    // First datapoint
				d.distance = 0
				d.topic = 1
			}
			
			j += 1;

		}else{      		// If not from mentioned user interactions 
				d.distance = 0
				
				for (var ii=0; ii<d.ClassNum.length; ii++){
					temp2 = d.ClassNum[0]
					temp[temp2[0]-1] = temp2[1];
				}
				d.topic = temp.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) + 1;
		}
	});
	
}
		// a function to define data points based on user defined time, topic and action weights.
function distanceFunction(){    
	// console.log(time_weight, topic_weight, action_weight)
	var temp_topic = 0;
	var temp_time = 0;
	var temp_color = 0;
	
	var k_topic = 1;
	var k_time = 1/100;
	var k_action = 1/50;
	
	var max_dist = 0;
	var temp_dur;
	// dataXRange.max = 0;   // uncomment to update page limits 
	// dataYRange.max = 0;
	
	
	var counter = 0
	var time_seg = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	
	chart_svg.selectAll(".datapoints")
			.attr("cx", function(d,i){
				if (time_weight > 0){  // Time n' Topic distance both
					// if (d.distance < 0.1){  // some cheating might be necessary 
						// d.distance = 0;
					// }
					d.t_distance  = d.Time - temp_time
					d.x_distance = (d.t_distance * time_weight * k_time) + (topic_weight * k_topic * d.distance);   
				}else{   				 // Topic distance only 
					d.x_distance = topic_weight * k_topic * d.distance;    
				}
				d.cluster = d.x_distance
				d.x_distance += temp_topic;
				temp_topic = d.x_distance; // topic_weight * k_topic * (d.distance);   // d.x_distance
				temp_time = d.Time;
				if (dataXRange.max < d.x_distance){dataXRange.max = d.x_distance;}
				if (max_dist < d.cluster){max_dist = d.cluster;}
				
				return x_scale(d.x_distance); 
				})
			.attr("cy", function(d){  	 // Seperating Eploration actions and insight actions
				if ((d.InteractionType == "highlight") | (d.InteractionType == "bookmark_highlights") | (d.InteractionType == "create_note") | (d.InteractionType == "writing_notes") | (d.InteractionType == "connection")) {
					d.y_distance = d.y_distance * action_weight * k_action;
				}else{ 
					d.y_distance = d.y_distance * action_weight * k_action;
				}  
				if (dataYRange.max < d.y_distance){dataYRange.max = d.y_distance;}
					return y_scale(d.y_distance); 
				})
			.style("fill", function(d){
				var threshold =  (max_dist * cluster_weight) / 100;
				if (d.cluster > threshold){   // if all in the same group ! 
					// var temp_color2 = temp_color;
					// temp_color = d.topic - 1;  // change only if distance > 0.5
					// if (temp_color == temp_color2) { temp_color = temp_color + 1;}
					temp_color += 1;
				}				
				if ((d.InteractionType == "open_document")) {
					return colors(temp_color);
				}
				else if (d.InteractionType == "reading_document"){
					return colors(temp_color);
				}else{
					return colors(temp_color);
				}
				
				});
				
		chart_svg.selectAll(".datapoints")
			.each(function(d){
				//console.log(d.axis_distance);
				if (d.Time > (each_time_sec*counter)) {   
					time_seg[counter] = d.x_distance;
					counter += 1;
				}
				else{	
				d.axis_distance = d.Time;
				}
			});

			
		x_scale.domain([dataXRange.min, dataXRange.max]).range([margin.left + points_size, width - points_size]);//  .range([0 + points_size, width - points_size]);
		y_scale.domain([dataYRange.min, dataYRange.max]).range([height - points_size - Axis_room, 0]);
		
		// xGroup.call(xAxis.scale(x_scale)); // .attr("transform", "translate(0," + (height - Axis_room) + ")");
		
		chart_svg.selectAll(".datapoints").attr("cx", function(d){return x_scale(d.x_distance); });
		chart_svg.selectAll(".datapoints").attr("cy", function(d){return y_scale(d.y_distance); });
		
		
		// console.log(time_seg);
		
		chart_svg.selectAll(".time_boxs").attr("x", function(d,i){d.axis_distance = time_seg[i]; return x_scale(d.axis_distance);}).attr("y", (height - Axis_room + 1));
				
		updateWindow()
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
		
		x_scale.domain([dataXRange.min, dataXRange.max]).range([margin.left + points_size, width - points_size]);// .range([0, width]);
		y_scale.domain([dataYRange.min, dataYRange.max]).range([height - points_size - Axis_room, 0]);
		
		// xGroup.call(xAxis.scale(x_scale)).attr("transform", "translate(0," + (height - Axis_room) + ")");
		
		chart_svg.selectAll(".datapoints").attr("cx", function(d){return x_scale(d.x_distance); });
		chart_svg.selectAll(".datapoints").attr("cy", function(d){return y_scale(d.y_distance); });
		
		svg.selectAll(".zoom_rect").attr("width", width );
		svg.selectAll(".zoom_rect").attr("height", height );

		svg.selectAll(".hide_rect").attr("width", width).attr("y", height - Axis_room + 1); //.attr("transform", "translate(0," + (height - Axis_room + 1	) + ")");

		chart_svg.selectAll(".time_boxs").attr("x", function(d){return x_scale(d.axis_distance);}).attr("y", (height - Axis_room + 10	));
	}
	
function zoomed() {
  xz_scale = d3.event.transform.rescaleX(x_scale);
  // xGroup.call(xAxis.scale(xz_scale));
  chart_svg.selectAll(".datapoints").attr("cx", function(d){return xz_scale(d.x_distance); });
  chart_svg.selectAll(".time_boxs").attr("x", function(d){return xz_scale(d.axis_distance );});
  chart_svg.selectAll(".time_boxs").moveToFront();
  // d3.selectAll(".datapoints").attr("cy", function(d){ return xz_scale(d.Duration); });
}
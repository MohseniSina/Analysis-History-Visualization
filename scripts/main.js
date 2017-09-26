

// <script language="javascript" type="text/javascript">
        $(function() {
            $("#allfields li").draggable({
                appendTo: "body",
                helper: "clone",
                cursor: "select",
                revert: "invalid"
            });
            initDroppable($("#TextArea"));
            function initDroppable($elements) {
                $elements.droppable({
                    hoverClass: "textarea",
                    accept: ":not(.ui-sortable-helper)",
                    drop: function(event, ui) {
                        var $this = $(this);
                        var tempid = ui.draggable.text();
                        var dropText;
                        if (tempid == "Example 1") {
                        	dropText = "Hi, I've recently had an MRI scan on my right knee that confirmed that I have 2 lesions on the hyaline cartilage on my tibia, one 5mm and one 6mm... However the pain I am having does not come from this area. I am finding that pain comes from around my patella when my knee is straightening and bearing weight, yet the MRI scan showed no damage to the patella. I should also mention that the meniscus is in tact and there is no locking, popping or crunching when straightening the knee. Does anybody know why I would be having pain around the patella when the lesions are at the back of my knee on the hyaline cartilage on the tibia? This has been happening for around 18 months now and I notice improvement when I avoid exercises that involve weight bearing during straightening the knee. Performing exercises that target the VMO muscle in the thigh have also helped. Thanks in advance for any advice you can provide.";
                        }else if (tempid == "Example 2") {
                        	dropText = "Hello! I am back here for similar reasons. I too suffer from shortness of breathe a lot sad I was prescribed an inhaler and it doesn't really help me...except it does temperorily make me feel better. I've tried breathing excersises and one thing I noticed is that I usually just breath through my nose, so I'm trying to breath out of both my nose and mouth more to maybe help get more oxygen through me. I do suggest you try breathing techniques. Especially through high-anxiety episodes such as panic attacks/hyperventilation. I wish you the best, and ranting on here makes me feel a lot better myself. We're all here to help and listen! I wish you the best xx ";
                        }else if (tempid == "Example 3") {
                        	dropText = "I was diagnosed 4 months ago by a general practitioner that I have IBS. I took Movicol sachets with water, but the gas and irritability did not go away. For the past week I have been using Spasmopep, (South African name), which is peppermint oil in a gel capsule. I feel great, no bloatedness, cramps or discomfort. Please speak to your doctor if you could take this natural, no-side-effect herb. You must be sure that you are not allergic to peppermint and make sure with your doctor if you can use it.";
                        }else if (tempid == "Example 4") {
                        	dropText = "That's the same as me been on Mirtazapine 15/30mg for 4 months. All of a sudden i started to suffer with insomnia, get to sleep ok but waking up in the middle of the night & unable to get back to sleep. Also suffered with increased anxiety, panic attacks e.t.c. while on the same dose, even before reducing the dosage. ";
                        }else if (tempid == "Example 5") {
                        	dropText = "The best thing you can do is not to worry.  Worry can irritate your gut.  Try to relax and get plenty of rest to help you recover from your infection.  Take one day at a time. I don't know how long it will take to feel better.  Everyone is different; bugs don't stick rigidly to a time frame.I had a bad reaction to antibiotics and was also recovering from gastric flu a  few years ago.  It happened before going on holiday.  All I could do was to eat very blandly and at times I could only take small sips of milk en route to Italy. I was really off my food.  I did not worry and just waited it out until the stomach reaction eventually passed.";
                    	}
                        var droparea = document.getElementById('TextArea');
                        var range1 = droparea.selectionStart;
                        var range2 = droparea.selectionEnd;
                        var val = droparea.value;
                        var str1 = val.substring(0, range1);
                        var str3 = val.substring(range1, val.length);
                        droparea.value = str1 + dropText + str3;
                    }
                });
            }
        });
    
function getText() {
    var output = document.getElementById("TextArea").value;
    console.log("text: ", output)

	svg.append("foreignObject").attr("class","explaination")
		.attr("x", explaination_x)
		.attr("y", explaination_y)
	    .attr("width", explaination_width)
	    .attr("height", explaination_height)
		.append("xhtml:body")
	    .style("font", "14px 'Helvetica Neue'")
	    .html(output);

}

function clearText() {
    document.getElementById("TextArea").value = ""
    svg.selectAll(".explaination").remove(); 
}

var hidRect;
var time_weight = 100, topic_weight = 0, action_weight = 400, cluster_weight = 20;
var max_y = 100;
var each_time_sec;
// var topic_distance;
var colors = d3.scaleOrdinal(d3.schemeCategory10); 

var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
d3.select(window).on('resize.updatesvg', updateWindow);

var svg = d3.select("#chartDiv").append("svg"),
    margin = {top: 20, right: 50, bottom: 20, left: 50};
	
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
  



	var list_x = 50
	var list_y = 50
	var	list_width = 180
	var	list_height = 600
	var clearance = 50
	var explaination_x = 1050
	var explaination_y = 450
	var explaination_height = 300
	var explaination_width = 400
	var frame_height = height - 100
	var result_height = 100

	var page_frame = chart_svg.append("g").append("rect")
					.attr("x", 5)
					.attr("y", 5)
					.attr("rx", 10)
					.attr("ry", 10)
					.attr("width", width)
					.attr("height", frame_height)
					.attr("fill", "lightblue")
					.style("fill-opacity",0.05)
					.style("stroke","blue")
					.style("stroke-opacity",0.5);

	chart_svg.append('text')
			  .text("Instance Explaination:")
			  .attr('dy','0.35em')
			  .attr('transform', 'translate(' + explaination_x+ ','+(explaination_y - 20)+')')

	chart_svg.append('text')
			  .text("Input:")
			  .attr('dy','0.35em')
			  .attr('transform', 'translate(' + explaination_x+ ','+(list_y +margin.top)+')')

	var explaination_frame = chart_svg.append("g").append("rect")
					.attr("x", explaination_x)
					.attr("y", explaination_y)
					.attr("rx", 5)
					.attr("ry", 5)
					.attr("width", explaination_width)
					.attr("height", explaination_height)
					.attr("fill", "white")
					.style("fill-opacity",1)
					.style("stroke","gray")
					.style("stroke-opacity",0.5);

	


d3.json("./data/sample.json", function(jsondata) {
	
	list_height = jsondata.length * 55 / 2

	var result_frame = chart_svg.append("g").append("rect")
					.attr("x", list_x )
					.attr("y", list_y + list_height + clearance/2)
					.attr("rx", 6)
					.attr("ry", 6)
					.attr("width", list_width * 2 + clearance)
					.attr("height", result_height)
					.attr("fill", "green")
					.style("fill-opacity",0.1)
					.style("stroke","green");

	chart_svg.append('text')
			  .text(function(d){return "Result: Symetom"})
			  .attr('dy','0.35em')
			  .attr('transform', 'translate(' + (list_x + clearance/2)+ ','+(list_y + list_height + clearance)+')')

	chart_svg.append("g").attr("class","bars").selectAll(".bars").data(jsondata).enter()
					.append("rect").attr("class","bars")
					.attr("x", list_x + clearance/2)
					.attr("y", list_y + list_height + 1.5*clearance)
					.attr("width", function(d){return 100* 1.3 * 0.8})  // d.score
					.attr("height", 10)
					.attr("fill", "blue")
		           .transition()
		           .duration(500)
		           .attr("width", function(d){return 100* 0.8})   //d.score
		           .attr("fill", "green");

	var list = chart_svg.append("g").append("rect")
					.attr("x", list_x)
					.attr("y", list_y)
					.attr("rx", 6)
					.attr("ry", 6)
					.attr("width", list_width)
					.attr("height", list_height)
					.attr("fill", "red")
					.style("fill-opacity",0.3)
					.style("stroke","red");

	var list = chart_svg.append("g").append("rect")
					.attr("x", list_x + list_width + clearance)
					.attr("y", list_y)
					.attr("rx", 6)
					.attr("ry", 6)
					.attr("width", list_width)
					.attr("height", list_height)
					.attr("fill", "blue")
					.style("fill-opacity",0.3)
					.style("stroke","blue");

	console.log("records: ", jsondata.length)
	var counter = 0
	var wordList = chart_svg.append("g").attr("class", "features_list").selectAll(".features_list")
						.data(jsondata).enter().append("text").attr("class", "features_list")
						.each(function (d,i) {
							if (d.class == "symptom"){
								d3.select(this).remove();
							}else{
								d.count = counter
								counter++; 
							}
						})
						.text(function(d){return d.feature})
						.attr("fill", "black")
						// .attr("dy", function(d){()=> {
						// 			var yP = d.count ? (2.0*d.count + 2.0).toString()+"em" : "2.0em";
						// 			return yP;
						// 		}})
						.attr("x", list_x + margin.left + 30)
						.attr("y", function(d){return (d.count*clearance + list_y + 45)})
						.attr("text-anchor", "middle")
						.attr("font-size", 22);

	var counter = 0
	var wordList2 = chart_svg.append("g").attr("class", "features_list").selectAll(".features_list")
						.data(jsondata).enter().append("text").attr("class", "features_list")
						.each(function (d,i) {
							if (d.class == "medication"){
								d3.select(this).remove();
							}else{
								d.count = counter
								counter++; 
							}
						})
						.text(function(d){return d.feature})
						.attr("fill", "black")
						.attr("x", list_x + margin.left + 30 + list_width + 50)
						.attr("y", function(d){return (d.count*clearance + list_y + 45)})
						.attr("text-anchor", "middle")
						.attr("font-size", 22);



	counter = 0
	var bars = chart_svg.append("g").attr("class","bars").selectAll(".bars").data(jsondata).enter()
					.append("rect").attr("class","bars")
					.each(function (d,i){
							if (d.class == "symptom"){
								d3.select(this).remove();
							}else{
								d.count = counter
								counter++; 
							}
						})
					.attr("x", function(d,i){return list_x+ 30 })
					.attr("y", function(d,i){return list_y + d.count*clearance + clearance })
					.attr("width", function(d){return 100* 1.3 * d.score})
					.attr("height", 10)
					.attr("fill", "blue")
		           .transition()
		           .duration(500)
		           .attr("width", function(d){return 100* d.score})
		           .attr("fill", "green");

    counter = 0
    var bars2 = chart_svg.append("g").attr("class","bars").selectAll(".bars").data(jsondata).enter()
					.append("rect").attr("class","bars")
					.each(function (d,i){
							if (d.class == "medication"){
								d3.select(this).remove();
							}else{
								d.count = counter
								counter++; 
							}
						})
					.attr("x", function(d,i){return list_x+ 30+ list_width + 50})
					.attr("y", function(d,i){return list_y + d.count*clearance + clearance })
					.attr("width", function(d){return 100* 1.3 * d.score})
					.attr("height", 10)
					.attr("fill", "blue")
		           .transition()
		           .duration(500)
		           .attr("width", function(d){return 100* d.score})
		           .attr("fill", "green");



	// updateWindow()
	
});

function updateWindow(){
							 
		// zoomRect.call(zoom.transform, d3.zoomIdentity);
	  	
		var chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth;
		var chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight;
		
		// margin.bottom = (1/3) * chart_y;
		
		width = chart_x - margin.left - margin.right;
		height = chart_y - margin.top - margin.bottom;    
		
		// zoom.translateExtent([[0, -Infinity], [width, Infinity]])
	
		svg.attr("width", width);
		svg.attr("height", height);
		svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// x_scale.domain([dataXRange.min, dataXRange.max]).range([margin.left + points_size, width - points_size]);// .range([0, width]);
		// y_scale.domain([dataYRange.min, dataYRange.max]).range([height - points_size, 0]);
		
		
		// chart_svg.selectAll(".datapoints").attr("cx", function(d){return x_scale(d.x_distance); });
		// chart_svg.selectAll(".datapoints").attr("cy", function(d){return y_scale(d.y_distance); });
		
		// svg.selectAll(".zoom_rect").attr("width", width );
		// svg.selectAll(".zoom_rect").attr("height", height );

		// svg.selectAll(".hide_rect").attr("width", width).attr("y", height - Axis_room + 1);

		// chart_svg.selectAll(".time_boxs").attr("x", function(d){return x_scale(d.axis_distance);}).attr("y", (height - Axis_room + 10	));
	}
	
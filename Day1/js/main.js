//Initialize SVG
	let width = 1140;
  	let height = 900;
  	let margin = 15;

	let svg = d3.select("#maincontainer")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("background", "#f5eac9;");

	let g = svg.append("g")
				.attr("class", "map")

	

	let color = d3.scaleSequential(d3.interpolatePurples)
    	.domain([0, 42])

	function colorCircle(object){
		let number = parseInt(object['Dock Count']);
		return color(number);
	}

    ////////////////////////////////////////////////////////////
	//////////////// Annotations /////////////////////////////
	////////////////////////////////////////////////////////////


	const annotations = [
      {
          type: d3.annotationCalloutCircle,
          note: {
            label: "Highest dock count",
            title: "Terry Francois Blvd",
            wrap: 190
          },
          subject: {
            radius: 8
          },
          x: 822,
          y: 457,
          dy: 127,
          dx: 90
        }, {
		    note: {
		      label: "Has no bike share stations",
		      title: "Sunset District"
		    },
		    type: d3.annotationCalloutRect,
		    subject: {
		      width: 170,
		      height: 200
		    },
		    x: 140,
		    y: 480,
		    dy: -20,
		    dx: -20
		  }].map(function(d){ d.color = "black"; return d})

    const makeAnnotations = d3.annotation()
          .type(d3.annotationLabel)
          .annotations(annotations)

	////////////////////////////////////////////////////////////
	//////////////// Main Function /////////////////////////////
	////////////////////////////////////////////////////////////



	d3.queue()
	    .defer(d3.json, "data/roads.json")
	    .defer(d3.json, "data/bikestations.json")
	    .await(createMap);

    function createMap(error, roads, stations){
    	if (error) throw error;

    	let projection = d3.geoMercator().fitExtent([[margin, margin], [width - margin, height - margin]], roads)
    	let pathGenerator = d3.geoPath().projection(projection).pointRadius(4)

    	g.selectAll('path')
	    	.data(roads.features)
 			.enter()
    		.append('path')
		    .attr('d', pathGenerator)
		    .attr('fill', 'none')
		    .attr('stroke', '#999999')
		    .attr('stroke-width', '0.4')

		let points = svg.append( "g" );

		points.selectAll( "path" )
			.data( stations.features )
			.enter()
			.append( "path" )
			.attr('id', d=> d.properties.sid)
			.attr( "fill", d=> colorCircle(d.properties) )
			.attr('opacity', 0.5)
			.attr('stroke','black')
			.attr('stroke-width', '0.8')
			// .attr('mouseover', d=> console.log(d.properties))
			.attr( "d", pathGenerator );

		d3.select(".map")
          .append("g")
          .attr("class", "annotation-group")
          .call(makeAnnotations)
	}

	 ////////////////////////////////////////////////////////////
	//////////////// Legend /////////////////////////////
	////////////////////////////////////////////////////////////

	let legendSvg = d3.select("#legendcontainer")
		.append("svg")
		.attr("width", 1140)
		.attr("height", 100)
		.style("background", "#f5eac9;");


	legendSvg.append("g")
		  .attr("class", "legendSequential")
		  .attr("transform", "translate(400,20)");

	let legendSequential = d3.legendColor()
	    .shapeWidth(40)
	    .shapeHeight(6)
	    .shapePadding(1)
	    .title('Dock Count')
	    .cells(10)
	    .labelFormat('d')
	    .orient("horizontal")
	    .scale(color) 

	legendSvg.select(".legendSequential")
	  .call(legendSequential);

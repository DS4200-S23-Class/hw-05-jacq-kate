// declare constants
const FRAME_HEIGHT = 300;
const FRAME_WIDTH = 300;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right

const FRAME1 = 
d3.select("#vis1")
	.append("svg")
		.attr("width", FRAME_WIDTH)
		.attr("height", FRAME_HEIGHT)
		.attr("class", "frame");

// reading from a file
d3.csv("data/scatter-data.csv").then((data) => {

	// scaling
	const MAX_X = d3.max(data, (d) => {return parseInt(d.x)});
	const MAX_Y = d3.max(data, (d) => {return parseInt(d.y)});

	const X_SCALE = d3.scaleLinear()
						.domain([0, MAX_X + 1])
						.range([0, VIS_WIDTH]);
	const Y_SCALE = d3.scaleLinear()
						.domain([0, MAX_Y + 1])
						.range([VIS_HEIGHT, 0]);

	// plot
	FRAME1.selectAll("points")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return X_SCALE(d.x) + MARGINS.left})
				.attr("cy", (d) => {return  Y_SCALE(d.y) + MARGINS.top})
				.attr("r", 10)
				.style("fill", "lightblue")
				.attr("class", "point");

	// x axis
	FRAME1.append("g")
			.attr("transform", 
					"translate(" + MARGINS.left + "," + (FRAME_HEIGHT - MARGINS.top) + ")")
				.call(d3.axisBottom(X_SCALE).ticks(10))
					.attr("font-size", "15px");

	// y axis
	FRAME1.append("g")
			.attr("transform", 
					"translate(" + MARGINS.left + "," + MARGINS.top + ")")
				.call(d3.axisLeft(Y_SCALE).ticks(10))
					.attr("font-size", "15px");

	// mouseover
	function handleMouseover(event, d) {
		d3.select(this).style("fill", "blue");
	}

	// mouseleave
	function handleMouseleave(event, d) {
		d3.select(this).style("fill", "lightblue");
	}

	let coords = [];

	// click
	function handleClick(event, d) {
		coord = "(" + d.x + "," + d.y + ")";

		// check if point is currently clicked
		if (d3.select(this).style("stroke") == "black") {
			d3.select(this).style("stroke", "none");

			// get index of clicked point's coordinate and remove
			index = coords.indexOf(coord);
			coords.splice(index, 1);
		}
		else {
			d3.select(this).style("stroke", "black");

			// add coordinate of point to list
			coords.push(coord);
		}

		// show coords
		d3.select("#coords")
				.html(coords);
	}

	// bind event listeners to points
	FRAME1.selectAll(".point")
			.on("mouseover", handleMouseover)
			.on("mouseleave", handleMouseleave)
			.on("click", handleClick);

	function addPoint() {
		// get user values
		let userX = d3.select("#xcoord").node().value;
		let userY = d3.select("#ycoord").node().value;

		// plot and bind event listeners to point
		FRAME1.selectAll("points")
				.data([{x: userX, y: userY}])
				.enter()
				.append("circle")
					.attr("cx", (d) => {return X_SCALE(d.x) + MARGINS.left})
					.attr("cy", (d) => {return  Y_SCALE(d.y) + MARGINS.top})
					.attr("r", 10)
					.style("fill", "lightblue")
					.attr("class", "userPoint")
					.attr("value", {x: userX, y: userY})
					.on("mouseover", handleMouseover)
					.on("mouseleave", handleMouseleave)
					.on("click", handleClick);
	}

	d3.select("#subButton")
			.on("click", addPoint);

	

});


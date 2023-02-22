// declare constants
const FRAME_HEIGHT = 500;
<<<<<<< Updated upstream
const FRAME_WIDTH = 400;
=======
const FRAME_WIDTH = 500;
>>>>>>> Stashed changes
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right

// frame for scatter 
const FRAME1 = 
d3.select("#vis1")
	.append("svg")
		.attr("width", FRAME_WIDTH)
		.attr("height", FRAME_HEIGHT)
		.attr("class", "frame");

// scatter plot from scatter data
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
				.attr("class", "point")
				.attr("cx", (d) => {return X_SCALE(d.x) + MARGINS.left})
				.attr("cy", (d) => {return  Y_SCALE(d.y) + MARGINS.top})
				.attr("r", 10)
				.style("fill", "lightblue");

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
		d3.select(this).style("fill", "slateblue");
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

		// plot and bind event listeners to point; give x, y data attributes
		FRAME1.selectAll("points")
				.data([{x: userX, y: userY}])
				.enter()
				.append("circle")
					.attr("class", "userPoint")
					.attr("cx", (d) => {return X_SCALE(d.x) + MARGINS.left})
					.attr("cy", (d) => {return  Y_SCALE(d.y) + MARGINS.top})
					.attr("r", 10)
					.style("fill", "lightblue")
					.on("mouseover", handleMouseover)
					.on("mouseleave", handleMouseleave)
					.on("click", handleClick);
	}

	// add on click event handler to submit button
	d3.select("#subButton")
			.on("click", addPoint);

});

// frame for bar
const FRAME2 =
d3.select("#vis2")
	.append("svg")
		.attr("width", FRAME_WIDTH)
		.attr("height", FRAME_HEIGHT)
		.attr("class", "frame");

// bar plot from bar data
d3.csv("data/bar-data.csv").then((data) => {
	const MAX_Y = d3.max(data, (d) => {return parseInt(d.amount)});
	const Y_SCALE = d3.scaleLinear()
						.domain([0, MAX_Y + 1])
						.range([VIS_HEIGHT, 0]);

	const MAX_X = d3.max(data, (d, i) => {return parseInt(i)});
	const X_SCALE = d3.scaleLinear()
						.domain([0, MAX_X + 1])
						.range([0, VIS_WIDTH]);

	const TICK_SCALE = d3.scaleBand(data.map((d) => d.category), 
									[0, FRAME_WIDTH - MARGINS.right])
							.paddingInner(0.01);

	// plot
	FRAME2.selectAll("bars")
			.data(data)
			.enter()
			.append("rect")
				.attr("class", "bar")
				.attr("x", (d, i) => {return X_SCALE(i + (i/6) + 0.15) + MARGINS.left})
				.attr("y", (d) => {return Y_SCALE(d.amount) + MARGINS.top})
				.attr("width", 40)
				.attr("height", (d) => {return VIS_HEIGHT - Y_SCALE(d.amount)})
				.style("fill", "lightblue");


	// x axis
	FRAME2.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + (FRAME_HEIGHT - MARGINS.top) + ")")
				.call(d3.axisBottom(TICK_SCALE))
					.attr("font-size", "15px"); 

	// y axis
	FRAME2.append("g")
			.attr("transform", 
					"translate(" + MARGINS.left + "," + MARGINS.top + ")")
				.call(d3.axisLeft(Y_SCALE).ticks(10))
					.attr("font-size", "15px");

	// tooltip
	const TOOLTIP = d3.select("#vis2")
						.append("div")
							.attr("class", "tooltip")
							.style("opacity", 0);

	// mouseover
	function handleMouseover(event, d) {
		d3.select(this).style("fill", "slateblue");
		TOOLTIP.style("opacity", 1);
	}

	// mousemove
	function handleMousemove(event, d) {
		TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
				.style("left", (event.pageX + 10) + "px")
				.style("top", (event.pageY - 50) + "px");
	}

	// mouseleave
	function handleMouseleave(event, d) {
		d3.select(this).style("fill", "lightblue");
		TOOLTIP.style("opacity", 0);
	}

	// add event listeners for bars
	FRAME2.selectAll(".bar")
			.on("mouseover", handleMouseover)
			.on("mousemove", handleMousemove)
			.on("mouseleave", handleMouseleave);
});















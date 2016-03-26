var body = document.querySelector("body");
var explore = document.querySelector(".discover-button");
var main = document.querySelector("main");
var topIcon = document.querySelector(".top-icon");

var tabs = [document.getElementById("tab1"), document.getElementById("tab2"),document.getElementById("tab3")];

explore.addEventListener("click", toggleMain);
topIcon.addEventListener("click", toggleMain);

for (let tab in tabs) {
    tabs[tab].addEventListener("click", () => {
        for (let otherTab of tabs)
            classie.remove(otherTab, "active-tab");
        classie.add(tabs[tab], "active-tab");
        makeTransition(tab);
    });
}

function makeTransition(tab) {
    console.log(`transitioning to ${tab}`);
}

function toggleMain() {
    classie.toggle(main, "hide-main");
    classie.toggle(body, "no-scroll");
}

// D3 STUFF

var tip = d3.tip().html(function(d) {
    return `<span class='tip'> ${d.word} Rating:${d.rating} Occurances: ${d.number}</span>`;
});

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = window.innerWidth*0.9 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([1.5, 80]);

var z = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(z)
    .orient("left")


var svg = d3.select(".word-plot").append("svg")
    .attr("class", "word-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("../data/allWords.json", function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.word.charAt(0); }));
  y.domain([d3.min(data, function(d) { return d.number}), d3.max(data, function(d) { return d.number})]);
  z.domain([d3.min(data, function(d) { return d.rating}), d3.max(data, function(d) { return d.rating})]);

  svg.call(tip);

  svg.append("g")
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
      .text("average rating");



  svg.selectAll(".word-circle")
      .data(data)
    .enter().append("ellipse")
      .attr("class", "word-circle")
      .attr("cx", function(d) {
		  return 15+x(d.word.charAt(0));
	  })
      .attr("cy", function(d) { return z(d.rating); })
      .attr("ry", function(d) { return y(d.number); })
	  .attr("rx", function(d) { return y(d.number); })
	  .on('mouseover', () => {
          tip.show;
          console.log("TIP ME");
      })
      .on('mouseout', tip.hide);
});

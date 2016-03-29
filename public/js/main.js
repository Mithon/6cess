var body = document.querySelector("body");
var explore = document.querySelector(".discover-button");
var main = document.querySelector("main");
var topIcon = document.querySelector(".top-icon");

var tabs = [document.getElementById("tab0"), document.getElementById("tab1"),document.getElementById("tab2")];
var panels = [document.getElementById("panel0"), document.getElementById("panel1"),document.getElementById("panel2")];
var currentTab = tabs[0];
var mainOpen = false;
var hoodData;

explore.addEventListener("click", toggleMain);
topIcon.addEventListener("click", toggleMain);

tabs[0].addEventListener("click", function() { makeTransition(this); });
tabs[1].addEventListener("click", function() { makeTransition(this); });
tabs[2].addEventListener("click", function() { makeTransition(this); });

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

function makeTransition(tab) {

    if (tab.dataset.tab != currentTab.dataset.tab) {
        for (var otherTab in tabs)  {
            classie.remove(tabs[otherTab], "active-tab");
        }

        classie.add(tab, "active-tab");
        console.log(`transitioning to tab:${tab.dataset.tab}`);

        switch (tab.dataset.tab) {
            case "0":
                classie.add(panels[tab.dataset.tab], "panel-current");                classie.remove(panels[currentTab.dataset.tab], "panel-current");
                classie.remove(panels[currentTab.dataset.tab], "panel-current");
                break;
            case "1":
                classie.add(panels[tab.dataset.tab], "panel-current");                classie.remove(panels[currentTab.dataset.tab], "panel-current");
                classie.remove(panels[currentTab.dataset.tab], "panel-current");
                break;
            case "2":
                classie.add(panels[tab.dataset.tab], "panel-current");                classie.remove(panels[currentTab.dataset.tab], "panel-current");
                classie.remove(panels[currentTab.dataset.tab], "panel-current");
                break;

        }
        console.log(currentTab.dataset.tab + " => " + tab.dataset.tab);
        currentTab = tabs[tab.dataset.tab];
    }
}

function toggleMain() {
    classie.toggle(main, "hide-main");
    classie.toggle(body, "no-scroll");

    setTimeout(function() {
        classie.toggle(body, "no-scroll");
    }, 800);

    mainOpen = !mainOpen;
}

// D3 STUFF

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
        return `<h4>${d.word}</h4>
            <span>Rating:${d.rating} //
            Occurances: ${d.number}</span>`;
});

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = window.innerWidth * 0.9 - margin.left - margin.right,
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
    .orient("left");


var svg = d3.select(".word-plot").append("svg")
    //.attr("class", "word-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("../data/allWords.json", function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.word.charAt(0); }));
    y.domain([d3.min(data, function(d) { return d.number }), d3.max(data, function(d) { return d.number })]);
    z.domain([d3.min(data, function(d) { return d.rating }), d3.max(data, function(d) { return d.rating })]);

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

    svg.call(tip);

    svg.selectAll(".word-circle")
        .data(data)
        .enter().append("ellipse")
        .attr("class", "word-circle")
        .attr("cx", function(d) {
            return 15 + x(d.word.charAt(0));
        })
        .attr("cy", function(d) { return z(d.rating); })
        .attr("ry", function(d) { return y(d.number); })
        .attr("rx", function(d) { return y(d.number); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
});


// MAP STUFF


tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
        return `<h4>${d.properties.AREA_NAME.split('(')[0]}</h4>
            <span>Area Code:${d.properties.AREA_CODE}
            </span>`;
    })
    .offset([0,20]);
var mapWidth = (window.innerWidth*0.9);
var mapHeight = 900;

var map = d3.select(".map-diagram").append("svg")
    .attr('class', 'toronto-map');

d3.json("../data/hoods.json", function(error, toronto) {
    if (error) throw error;

    var projection = d3.geo.albers()
        .scale(1)
        .rotate([0, 0])
        .translate([mapWidth / 2, mapHeight / 2]);

    var path = d3.geo.path()
        .projection(projection);

    map.call(tip);

    var hoods = topojson.feature(toronto, toronto.objects.hoods);
    var b = d3.geo.bounds(hoods);
    projection.center([(b[1][0] + b[0][0]) / (2), (b[1][1] + b[0][1]) / 2]);
    projection.scale([70 / Math.max(
        (b[1][0] - b[0][0]) / (mapWidth-0),
        (b[1][1] - b[0][1]) / (mapHeight-0)
    )]);


    map.selectAll(".hood")
    .data(hoods.features)
    .enter().append("path")
    .attr('transform', `translate(-${80}) rotate (-34, ${mapWidth/2}, ${mapHeight/2})`)
    .attr("class", function(d) { return "hood " + "n"+d.properties.AREA_CODE; })
    .attr("d", path)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

    /*
    map.append("path")
        .datum(hoods)
        .attr("class", "toronto")
        .attr("d", path)
        .attr('transform', `translate(-${0}) rotate (-34, ${mapWidth/2}, ${mapHeight/2})`)
        .on('mouseover', function() {
            this.attr("class", "highlight-map");
        });

    */
    map.append("path")
        .datum(topojson.mesh(toronto, toronto.objects.hoods, function(a, b) {
            return a !== b;
        }))
        .attr("class", "hood-boundary")
        .attr("d", path)
        .attr('transform', `translate(-${80}) rotate (-34, ${mapWidth/2}, ${mapHeight/2})`);

    d3.json("../data/hoodDataInfo.min.json", function(error, json) {
            if (error) return console.warn(error);
            hoodData = json;
            colourMap();
    });
});

function colourMap() {
    var scales = [
        d3.scale.linear()
            .domain([25, 50, 75, 100])
            .range(["red", "orange", "yellow", "white"])
    ];
    var scaleMe = d3.scale.linear()
        .domain([25, 50, 75, 100])
        .range(["red", "orange", "yellow", "white"]);
    for (var i in hoodData) {
        var id = ('000' + hoodData[i].areaCode).substr(-3);
        var hood = document.querySelector((`.n${id}`));

        hood.style.fill = createScale('walkscore', ['Teal','salmon'])(hoodData[i].walkscore);
        //hood.style.opacity = hoodData[i].walkscore/100;
    }
}

function createScale(dataParam, colors) {
    var totalVars = [];
    for (var i of hoodData) {
        totalVars.push(i[dataParam]);
    }
    return d3.scale.linear()
        .domain([Array.min(totalVars), Array.max(totalVars)])
        .range([colors[0], colors[1]]);
}







makeTransition(tabs[1]);

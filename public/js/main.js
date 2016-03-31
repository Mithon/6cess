var body = document.querySelector("body");
var explore = document.querySelector(".discover-button");
var main = document.querySelector("main");
var topIcon = document.querySelector(".top-icon");

var tabs = [document.getElementById("tab0"), document.getElementById("tab1"),document.getElementById("tab2")];
var panels = [document.getElementById("panel0"), document.getElementById("panel1"),document.getElementById("panel2")];
var currentTab = tabs[0];
var mainOpen = false;
var hoodData;
var activeParam = 'population';
var paramScales;
var compareHoods = [];

explore.addEventListener("click", toggleMain);
topIcon.addEventListener("click", toggleMain);

tabs[0].addEventListener("click", function() { makeTransition(this); });
tabs[1].addEventListener("click", function() { makeTransition(this); });
tabs[2].addEventListener("click", function() { makeTransition(this); });

var terms = {
    "population": "Population",
    "areaCode": "Area Code",
    "avgRating": "Average Yelp Score",
    "avgRCount": "Average Yelp Rating Count",
    "walkscore": "Walkscore",
    "homePrices": "Average Home Price",
    "assaults": "Assaults",
    "arsons": "Arsons",
    "robberies": "Robberies"
};

WebFontConfig = {
    google: { families: [ 'Roboto+Mono:300:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

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

var wordGwidths = window.innerWidth*0.6;

var hRatings = d3.select(".top-words").append("svg")
    .attr('width', (wordGwidths+100))
    .attr('height', 300)
    .append("g");

var lRatings = d3.select(".bottom-words").append("svg")
    .attr('width', (wordGwidths/2+100))
    .attr('height', 300)
    .append("g");

var hOccur = d3.select(".most-words").append("svg")
    .attr('width', (wordGwidths/2+100))
    .attr('height', 300)
    .append("g");

d3.json("../data/allWords.json", function(error, data) {
    if (error) throw error;

    var wordsRatingsArr = (data.slice().sort(compareRatings));
    var wordsHRatings = wordsRatingsArr.slice(0, 6);
    var wordsLRatings = wordsRatingsArr.slice(wordsRatingsArr.length-6, wordsRatingsArr.length).reverse();
    var wordsHOccur = data.slice().sort(compareNumbers).slice(0,6);

    var wordHRatingsScale = d3.scale.linear()
        .range([0, wordGwidths])
        .domain([d3.min(wordsHRatings, function(d) { return d.rating; }), d3.max(wordsHRatings, function(d) { return d.rating; })]);

    var wordLRatingsScale = d3.scale.linear()
        .range([0, (wordGwidths/2)])
        .domain([d3.min(wordsLRatings, function(d) { return d.rating; }), d3.max(wordsLRatings, function(d) { return d.rating; })]);

    var wordHOccurScale = d3.scale.linear()
        .range([0, wordGwidths/2])
        .domain([d3.min(wordsHOccur, function(d) { return d.number; }), d3.max(wordsHOccur, function(d) { return d.number; })]);

    x.domain(data.map(function(d) { return d.word.charAt(0); }));
    y.domain([d3.min(data, function(d) { return d.number }), d3.max(data, function(d) { return d.number })]);
    z.domain([d3.min(data, function(d) { return d.rating }), d3.max(data, function(d) { return d.rating })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width-(width/5))
        .attr("y", -5)
        .attr("dx", ".2em")
        .style("text-anchor", "start")
        .text("x: alphabetical order // radius: occurances");


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


    var hRatingsBar = hRatings.selectAll(".word-bars")
        .data(wordsHRatings)
        .enter().append('g')
        .attr("transform", function(d, i) { return "translate(0," + i * 38 + ")"; });


    hRatingsBar.append('rect')
        .attr('class', "word-bars")
        .attr('width', function(d) { return wordHRatingsScale(d.rating)+100; })
        .attr('height', 30)
        .attr("dy", ".35em")

    hRatingsBar.append("text")
        .attr('class', "word-bar-text")
        .attr("x", 8)
        .attr("y", 15)
        .attr("dy", ".35em")
        .text(function(d) { return `${d.word} - ${d.rating}`; });

    var lRatingsBar = lRatings.selectAll(".word-bars")
        .data(wordsLRatings)
        .enter().append('g')
        .attr("transform", function(d, i) { return "translate(0," + i * 38 + ")"; });

    lRatingsBar.append('rect')
        .attr('class', "word-bars")
        .attr('width', function(d) { return wordLRatingsScale(d.rating)+100; })
        .attr('height', 30)
        .attr("dy", ".35em")

    lRatingsBar.append("text")
        .attr('class', "word-bar-text")
        .attr("x", 8)
        .attr("y", 15)
        .attr("dy", ".35em")
        .text(function(d) { return `${d.word} - ${d.rating}`; });

    var hOccurBar = hOccur.selectAll(".word-bars")
        .data(wordsHOccur)
        .enter().append('g')
        .attr("transform", function(d, i) { return "translate(0," + i * 38 + ")"; });

    hOccurBar.append('rect')
        .attr('class', "word-bars")
        .attr('width', function(d) { return wordHOccurScale(d.number)+100; })
        .attr('height', 30)
        .attr("dy", ".35em");

    hOccurBar.append("text")
        .attr('class', "word-bar-text")
        .attr("x", 8)
        .attr("y", 15)
        .attr("dy", ".35em")
        .text(function(d) { return `${d.word} - ${d.number}`; });

});

function compareWords(param) {
    function compare(a,b) {
      if (a[param] < b[param])
        return -1;
      else if (a[param] > b[param])
        return 1;
      else
        return 0;
    }
}

function compareRatings(a,b) {
  if (a.rating > b.rating)
    return -1;
  else if (a.rating < b.rating)
    return 1;
  else
    return 0;
}

function compareNumbers(a,b) {
  if (a.number > b.number)
    return -1;
  else if (a.number < b.number)
    return 1;
  else
    return 0;
}

// MAP STUFF


mapTip = d3.tip()
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

//var selectedHoodOne = d3.select(".selection-one").append("svg")
    //.attr('class', 'hood-map hood-one');

d3.json("../data/hoods.json", function(error, toronto) {
    if (error) throw error;

    var projection = d3.geo.albers()
        .scale(1)
        .rotate([0, 0])
        .translate([mapWidth / 2, mapHeight / 2]);

    var path = d3.geo.path()
        .projection(projection);

    map.call(mapTip);

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
    .on('mouseover', mapTip.show)
    .on('mouseout', mapTip.hide)
    .on("click", function(d) {
        var hoodElementHTML = document.querySelector(`.n${d.properties.AREA_CODE}`);

        addCompareHood(d.properties.AREA_CODE);
        if (classie.has(hoodElementHTML, 'active-hood')) {
            classie.remove(hoodElementHTML, 'active-hood');
        } else {
            classie.add(hoodElementHTML, 'active-hood');
        }

    });

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


    /*
    var selectedHoodPath = document.querySelector(".n004");

    var hoodOne = document.querySelector(".hood-one");

    var cln = selectedHoodPath.cloneNode(true);
    cln.setAttribute('transform',`translate(-420, -420)`);

    hoodOne.appendChild(cln);
    */


    d3.json("../data/hoodDataInfo.min.json", function(error, json) {
            if (error) return console.warn(error);
            hoodData = json;

            paramScales = {
                "population": createScale("population"),
                "areaCode": createScale("areaCode"),
                "avgRating": createScale("avgRating"),
                "avgRCount": createScale("avgRCount"),
                "walkscore": createScale("walkscore"),
                "homePrices": createScale("homePrices"),
                "assaults": createScale("assaults"),
                "arsons": createScale("arsons"),
                "robberies": createScale("robberies")
            };

            colourMap();
    });
});

function colourMap(param) {
    param = param || 'population';

    for (var i in hoodData) {
        var id = ('000' + hoodData[i].areaCode).substr(-3);
        var hood = document.querySelector((`.n${id}`));
        hood.style.fill = paramScales[param](hoodData[i][param]);
    }
}

function createScale(param, colors) {
    colors = colors || ['#19232C','#00FFEA'];
    var totalVars = [];
    for (var i of hoodData) {
        totalVars.push(i[param]);
    }
    return d3.scale.linear()
        .domain([d3.min(totalVars), d3.max(totalVars)])
        .range([colors[0], colors[1]]);
}

function addCompareHood(areaCode) {
    var d = hoodData[parseInt(areaCode)-1];
    d.AREA_CODE = areaCode;
    if (compareHoods.length > 1) {
        classie.remove(document.querySelector((`.n${compareHoods[0].AREA_CODE}`)), 'active-hood');

        compareHoods.shift();
        compareHoods.push(d);
    } else {
        compareHoods.push(d);
    }
    console.log(compareHoods);

    if (compareHoods[0].hasOwnProperty("name"))
        document.querySelector(".hood-title-one").innerHTML = compareHoods[0].name;



    var hoodOne = document.querySelector(".selection-one-info");
    var hoodTwo = document.querySelector(".selection-two-info");

    hoodOne.innerHTML = " ";
    hoodTwo.innerHTML = " ";

    for (var param in terms)  {
        if (compareHoods[0].hasOwnProperty("name")) {
            if (param == 'avgRating' || param == 'avgRCount') {
                hoodOne.innerHTML = hoodOne.innerHTML + `<p>${terms[param]}: ${compareHoods[0][param].toFixed(2)}</p>`;
            } else {
                hoodOne.innerHTML = hoodOne.innerHTML + `<p>${terms[param]}: ${compareHoods[0][param]}</p>`;
            }
            console.log("SHIT");
        }
    }

    if (compareHoods[1].hasOwnProperty("name"))
        document.querySelector(".hood-title-two").innerHTML = compareHoods[1].name;

    for (var param in terms)  {
        if (compareHoods[1].hasOwnProperty("name")) {
            if (param == 'avgRating' || param == 'avgRCount') {
                hoodTwo.innerHTML = hoodTwo.innerHTML + `<p>${terms[param]}: ${compareHoods[0][param].toFixed(2)}</p>`;
            } else {
                hoodTwo.innerHTML = hoodTwo.innerHTML + `<p>${terms[param]}: ${compareHoods[0][param]}</p>`;
            }
            console.log("SHIT2");
        }
    }

}

function changeTip(param) {

    mapTip.html(function(d) {
        if (param == 'avgRating' || param == 'avgRCount') {
            var dataText = (hoodData[parseInt(d.properties.AREA_CODE)-1][param]).toFixed(2);
        } else {
            var dataText = (hoodData[parseInt(d.properties.AREA_CODE)-1][param]);
        }
        return `<h4>${hoodData[parseInt(d.properties.AREA_CODE)-1].name}</h4>
            <span>${terms[param]}:${dataText}
            </span>`;
    })

}

function changeMap(param) {
    colourMap(param);
    changeTip(param);
}





makeTransition(tabs[1]);

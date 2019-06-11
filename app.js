// @TODO: YOUR CODE HERE!
//Level 1
// Step 1: Set up our chart
//= ================================
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 110
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "obesityHigh"

// function used for updating x-scale & y-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.1
        ])
        .range([0, width]);

    return xLinearScale;

}

function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.2,
        d3.max(data, d => d[chosenYAxis]) * 2.0
        ])
        .range([height, 0]);

    return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}


// function used for updating text in circles with a transition to
// new text
function renderCirclesTextX(circlesText, newXScale, chosenXAxis) {

    circlesText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return circlesText;
}

function renderCirclesTextY(circlesText, newYScale, chosenYAxis) {

    circlesText.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));

    return circlesText;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    switch (chosenXAxis) {
        case "age":
            var Xlabel = "Age:";
            break;

        case "income":
            var Xlabel = "Income:";
            break;

        case "poverty":
            var Xlabel = "Poverty:";
            break;
    }

    switch (chosenYAxis) {
        case "obesityHigh":
            var Ylabel = "Obesity:";
            break;

        case "smokesHigh":
            var Ylabel = "Smoking Prevalence:";
            break;

        case "healthcareLow":
            var Ylabel = "Healthcare:";
            break;
    }


    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, 60])
        .html(function (d) {
            return (`${d.state}<br>${Xlabel} ${d[chosenXAxis]}<br>${Ylabel} ${d[chosenYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
    // onmouseout event
        .on("mouseout", function (data, index) {
        toolTip.hide(data);
    });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below

d3.csv("censusData.csv").then(function (censusData) {

    // parse data
    censusData.forEach(function (data) {
        data.age = +data.age;
        data.income = +data.income;
        data.poverty = +data.poverty;

        data.obesityHigh = +data.obesityHigh;
        data.smokesHigh = +data.smokesHigh;
        data.healthcareHigh = +data.healthcareLow;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // xLinearScale function above csv import
    var yLinearScale = xScale(censusData, chosenYAxis);

    // // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    //     .domain([0, d3.max(censusData, d => d.obesity)])
    //     .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5")
        .on("mouseover", function(data){
            toolTip.show(data);
        })
        // on mouseout
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    // append initial circles
    var circlesText = chartGroup.selectAll("text#circletext")
        .data(censusData)
        .enter()
        .append("text")
        .attr("id", "circletext")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("fill", "black")
        .text(d => d.abbr);

    // Create group for  3 x- axis labels
    var XlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age");

    var incomeLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income");

    var povertyLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("Poverty (%)");

    // Create group for  3 y- axis labels
    var YlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left / 4}, ${height / 2})`);

    var obesityLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 15)
        .attr("y", -15)
        .attr("value", "obesityHigh") // value to grab for event listener
        .classed("active", true)
        .text("High Obesity (%)");

    var smokingLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 15)
        .attr("y", -40)
        .attr("value", "smokesHigh") // value to grab for event listener
        .classed("active", true)
        .text("High Smoking Prevalence (%)");

    var healthcareLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 15)
        .attr("y", -65)
        .attr("value", "healthcareLow") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    XlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
                circlesText = renderCirclesTextX(circlesText, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                switch (chosenXAxis) {
                    case "age":
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;

                    case "income":
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;

                    case "poverty":
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        break;
                }

            }
        });

    YlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(censusData, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
                circlesText = renderCirclesTextY(circlesText, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                switch (chosenYAxis) {
                    case "obesityHigh":
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokingLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;

                    case "smokesHigh":
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokingLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;

                    case "healthcareLow":
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokingLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        break;
                }

            }
        });
});

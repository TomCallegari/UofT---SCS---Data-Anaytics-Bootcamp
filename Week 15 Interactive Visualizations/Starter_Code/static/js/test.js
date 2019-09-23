// -----------------------------------------------
// FUNCTION #1
// get the array of Ids from Names
function getIdNames(dataId) {

    // returns an array of strings
    var idNames = dataId["names"];

    // return the array of Ids
    return idNames;
}
// -----------------------------------------------
// FUNCTION #2
// from getIdName() function determine index position of
// id selected
function getIndex(dataIndex, id) {

    // get the array of Ids
    var idNames = getIdNames(dataIndex);

    // get the index value for id of interest
    var idIndex = idNames.indexOf(id);

    // return the index value of selected id
    return idIndex;
}
// -----------------------------------------------
// FUNCTION #3
// get samples - list of objects
function getSamples(dataSamples) {

    // get the array of samples objects
    var arraySample = dataSamples["samples"];

    // return array of samples objects
    return arraySample;
}
// -----------------------------------------------
// FUNCTION #4
// get index value for a specific object
function getIndexSamples(dataIndexSamples, id) {

    // get the array of samples objects
    var arraySample = getSamples(dataIndexSamples);

    // find the index using findIndex
    var arrayIndex = arraySample.findIndex(x => x["id"] === id);

    // return the index value
    return arrayIndex;
}
// -----------------------------------------------
// FUNCTION #5
// get the otu_ids, sample_values and otu_labels
// for a given index value in samples
function getArraySamples(dataArraySamples, id, array) {

    // get the array of samples objects
    var arraySample = getSamples(dataArraySamples);

    // get the index value for the given id selected
    var arrayIndex = getIndexSamples(dataArraySamples, id);

    // get the arrays
    var arrayArray = arraySample[arrayIndex][array];

    // return the array
    return arrayArray;
}
// -----------------------------------------------
// FUNCTION #6
// data for both bar chart and bubble chart are assembled into
// an object here
function bothCharts(dataCharts, id) {

    // create an object holding all 3 array for a given id
    var otuId = getArraySamples(dataCharts, id, "otu_ids");
    var sampleValues = getArraySamples(dataCharts, id, "sample_values");
    var otuLabels = getArraySamples(dataCharts, id, "otu_labels");

    // generate a temporary object holding all the results
    var tempObject = []
    for (var i = 0; i < otuId.length; i++) {
        
        // take the long string and split it into an array
        var otuLabelSplit = otuLabels[i].split(";");

        // generate the object with otu_id, otu_labels and
        // sample_values
        tempObject.push({
            otu_id : otuId[i],
            otu_labels_split : otuLabelSplit,
            otu_labels : otuLabels[i],
            sample_values : sampleValues[i]
        });
    }
    // return this array of objects
    return tempObject;
}
// -----------------------------------------------
// FUNCTION #7
// for the bar chart sort the object from Function #6
// then take only the top 10 sample_values, otu_ids and otu_labels
function sortsliceBarChart(dataBarChart, id) {

    // sort the object in descending order of sample_values
    var sortObject = bothCharts(dataBarChart, id).sort((a,b) => b.sample_values - a.sample_values);
    
    // take the top 10 values in the 
    var sliceObject = sortObject.slice(0, 10);
    
    // return the top 10 array of objects
    return sliceObject;
}
// -----------------------------------------------
// FUNCTION #8
// get metadata - list of objects
function getMetadata(dataMetadata) {

    // get the array of metadata objects
    var arraySample = dataMetadata["metadata"];

    // return array of metadata objects
    return arraySample;
}
// -----------------------------------------------
// FUNCTION #9
// get index value for a specific object
function getIndexMetadata(dataIndexMetadata, id) {

    // get the array of metadata objects
    var arrayMetadata = getMetadata(dataIndexMetadata);

    // find the index using findIndex
    var arrayIndex = arrayMetadata.findIndex(x => x["id"] === parseInt(id, 10));

    // return the index value
    return arrayIndex;
}
// -----------------------------------------------
// FUNCTION #9
// get the object for a given index value
// This information is to generate the demographic info table
function demographicDataObject(dataDemographic, id) {

    // get the object at a given index value
    var arrayMetadataID = getMetadata(dataDemographic)[getIndexMetadata(dataDemographic, id)];

    // return the object
    return arrayMetadataID;
}
// -----------------------------------------------
// FUNCTION #10
// get the necessary ingrediants for the bar chart
// this function can be removed but is kept for the
// object it creates
function initBarChart(dataInitBar, idPerson) {

    // get the top 10 results in an object
    var sampleChartValues = sortsliceBarChart(dataInitBar, idPerson);
    
    // several empty arrays to append to
    var otuIDSlice = [];
    var otulabelsSlice = [];
    var sampleValuesSlice = [];

    // append the object values to arrays
    // not really required but easier to work with
    sampleChartValues.forEach((x) => {
        otuIDSlice.push(x.otu_id);
        otulabelsSlice.push(x.otu_labels_split);
        sampleValuesSlice.push(x.sample_values);
    });

    // re-add the id
    // not really required but easier to work with
    var objectSlice = {
        id: idPerson,
        otu_id: otuIDSlice,
        otu_labels: otulabelsSlice,
        sample_values: sampleValuesSlice
    };
    // return object
    return objectSlice;
}
// -----------------------------------------------
// FUNCTION #11
// get the necessary ingrediants for the bubble chart
// this function can be removed but is kept for the
// object it creates
function initBubbleChart(dataInitBar, idPerson) {

    // get all the results for an ID
    // do not sort
    // it will be sorted in function #13
    var sampleChartValues = bothCharts(dataInitBar, idPerson);

    // several empty arrays to append to
    var otuIDFull = [];
    var otulabelsFull = [];
    var otulabelsSplitFull = [];
    var sampleValuesFull = [];

    // append to arrays
    sampleChartValues.forEach((x) => {
        otuIDFull.push(x.otu_id);
        otulabelsFull.push(x.otu_labels);
        otulabelsSplitFull.push(x.otu_labels_split);
        sampleValuesFull.push(x.sample_values);
    });

    // re-add the id
    // not really required but easier to work with
    var objectFull = {
        id: idPerson,
        otu_id: otuIDFull,
        otu_labels: otulabelsFull,
        otu_labels_split: otulabelsSplitFull,
        sample_values: sampleValuesFull
    };
    // return object
    return objectFull;
}
// -----------------------------------------------
// FUNCTION #12
// create the bar chart with Plotly.js
function initBarChartPlotly(dataInitBar, idPerson) {

    // call function #10 for the bar chart ingredients
    var objectPlotly = initBarChart(dataInitBar, idPerson);

    // need to reverse() the arrays and map values to the elements
    // to match the requirements
    var sampleChart = objectPlotly.sample_values.reverse();
    var idChart = objectPlotly.otu_id.map((x) => "OTU " + x).reverse();
    var otuLabelsSample = objectPlotly.otu_labels.map((x) => "OTU Labels: " + x).reverse();
    var idSample = idPerson;

    // trace for bar chart
    var trace1 = {
        x: sampleChart,
        y: idChart,
        text: otuLabelsSample,
        hovertemplate: `Sample Value: %{x}` +
                        `<br>%{text}`,
        type: "bar",
        orientation: "h",
        name: "Top 10",
        showlegend: false
    };
    // data for bar chart
    var data = [trace1];
    // layout for bar chart
    var layout = {
        title: `<b>Top 10 OTUs from ID: ${idSample}</b>`,
        xaxis: { title: "Sample Values:  Sequencing Read Numbers" },
    }
    // Draw the bar chart using the Plotly library
    Plotly.newPlot("bar", data, layout);
}
// -----------------------------------------------
// FUNCTION #13
// due to requirements need to have marker size and marker colour
// dependant on sample_values and otu_id respectively
function markerSizeColour(data, idValues) {
    
    var objectbubbleChart = bothCharts(data, idValues).sort((a,b) => b.sample_values - a.sample_values).reverse();

    // get the values needed to range out the sizes and colour
    var sampleValuesLength = objectbubbleChart.length;
    var blueColour = 255;
    var minSize = 1;
    var maxSize = 600;
    var diffSize = (Math.round((maxSize - minSize) / sampleValuesLength)/10);
    
    // determine the difference between sizes and values
    var diffSize = (Math.round((maxSize - minSize) / sampleValuesLength)/10);
    var diffRed = Math.round((255 - 0) /sampleValuesLength)
    var diffGreen = Math.round((150 - 0) /sampleValuesLength)

    // empty lists to append to
    var blueColourList = [];
    var redColour = [];
    var greenColour = [];
    var markerSize = [];

    // append to rray size values
    for (var i = 0; i < sampleValuesLength; i++) {
        markerSize.push(
            (minSize + (diffSize * (i + 1)))
        );
    }

    // append to arrays colour values
    for (var i = 0; i < sampleValuesLength; i++) {
        redColour.push(
            (0 + (diffRed * i))
        );
        greenColour.push(
            (0 + (diffGreen * i))
        );
        blueColourList.push(blueColour);
    }

    objectbubbleChart.size = markerSize;
    objectbubbleChart.red = redColour;
    objectbubbleChart.green = greenColour;
    objectbubbleChart.blue = blueColourList;

    return objectbubbleChart;
}
// -----------------------------------------------
// FUNCTION #14
// create the bar chart with Plotly.js
function initBubbleChartPlotly(dataInitBar, idPerson) {

    // call function #11 to get ingredients for bubble chart
    // reverse the sample_values, otu_id, otu_labels
     // call function #13 for marker size and colours
    var bubbleProperties = markerSizeColour(dataInitBar, idPerson);
    var objectPlotly = initBubbleChart(dataInitBar, idPerson);
    var sampleChart = objectPlotly.sample_values.reverse()
    var idChart = objectPlotly.otu_id.reverse()
    var otuLabelsSample = objectPlotly.otu_labels.reverse()

    // append to string the red, green, and blue values to rgb() format
    var colorString = [];
    for (var i = 0; i < bubbleProperties.red.length; i++) {
        colorString.push(
            `rgb(${bubbleProperties.red[i]}, ${bubbleProperties.green[i]}, ${bubbleProperties.blue[i]})`
        );
    }

    // trace for plotly
    var trace1 = {
        x: idChart,
        y: sampleChart,
        text: otuLabelsSample.map((x) => "OTU Labels: " + x),
        hovertemplate: `Sample Value: %{y}` +
                        `<br>%{text}`,
        mode: 'markers',
        marker: {
            color: colorString,
            size: bubbleProperties.size
        },
        name: "All OTUs"
    };
    // data for plotly
    var data = [trace1];
    // layout for plotly
    var layout = {
        title: `<b>All ${trace1.x.length} OTUs from ID: ${idPerson}</b>`,
        xaxis: { title: "OTU_ID" },
        yaxis: { title: "Sample Values:  Sequencing Read Numbers" },
        showlegend: false,
        height: 600,
        width: 1200
    };
    // plot the bubble plot
    Plotly.newPlot('bubble', data, layout);
}
// -----------------------------------------------
// FUNCTION #15
// create the demographic info table
function initDemographicInfo(dataInitBar, idPerson) {

    // retrieve the object containing all the necessary information
    var objectMetadata = demographicDataObject(dataInitBar, idPerson);

    // use d3.select() to find the div for the demographic info
    var demogInfo = d3.select("#sample-metadata");
    // use .append() to add a <table> tag
    var tTable = demogInfo.append("table");
    // change the <table> class for bootstrap css
    demogInfo.select("table").attr("class", "table table-striped")
    // use .append() to add a <thead> tag, do not add <tr.
    tTable.append("thead");
    // use .append() to add a <tbody> tag, <tr> will be added later
    tTable.append("tbody");

    // get the entries foe the object
    var dataTempArray = Object.entries(objectMetadata);

    // use d3 to add <tr> and <td> containing the keys and values
    demogInfo.select("tbody")
        .selectAll("tr")
        .data(dataTempArray)
        .enter()
        .append("tr")
        .html(function(d) {
        return `<td>${d[0]}</td><td><b>${d[1]}</b></td>`;
        });
}
// -----------------------------------------------
// FUNCTION #16
// for some reason this improves how the DOM loads
// the DOM does not always load on refresh or clearing the cache
function init() {
    // since variables only have value when json is accessed
    // all the javascript for d3 functionality and plot.ly plots
    // will be located within d3.json().then() function
    d3.json("static/json/samples.json").then((data) => {
        
        // overall samples.json
        console.log(data);

        // declare the pathway to the various display elements
        var selectID = d3.select("#selDataset");
        var barID = d3.select("#bar");
        var gaugeID = d3.select("#gauge");
        var bubbleID = d3.select("#bubble");
        var demogInfo = d3.select("#sample-metadata");

        // -----------------------------------------------
        // FUNCTION #17
        // On initialization populate the options with 153 values
        function init2() {

            // get all ID values
            var nameArray = getIdNames(data);

            // generate the <option> tags for the <select>
            selectID.selectAll("option")
                .data(nameArray)
                .enter()
                .append("option")
                .html((d) => {
                    var id = "id-"
                    return `<option id=${id+d} value=${d}>${d}</option>`;
            });
            
            var selectIDValue = selectID.property("value");
            console.log("Selected ID: " + selectIDValue);

            var indexValue = getIndex(data, selectIDValue);
            console.log("Index: " + indexValue);

            var chartObject = bothCharts(data, selectIDValue);
            console.log("All Data for given ID:")
            console.log(chartObject);

            var metadataObject = demographicDataObject(data, selectIDValue);
            console.log("All Metadata for given ID:");
            console.log(metadataObject);

            var chartObjectSlice = sortsliceBarChart(data, selectIDValue);
            console.log("Top 10 data_values:")
            console.log(chartObjectSlice);

            // reset all html elements
            barID.html("");
            gaugeID.html("");
            bubbleID.html("");
            demogInfo.html("");
            // plot and create table functions
            initBarChartPlotly(data, nameArray[0]);
            initGaugePlotly(data, nameArray[0]);
            initBubbleChartPlotly(data, nameArray[0]);
            initDemographicInfo(data, nameArray[0]);
        }
        // need to call the function somewhere
        init2();

        // d3 on change event in <select> tag
        selectID.on("change", function() {

            var selectIDValue = selectID.property("value");
            console.log("Selected ID: " + selectIDValue);

            var indexValue = getIndex(data, selectIDValue);
            console.log("Index: " + indexValue);

            var chartObject = bothCharts(data, selectIDValue);
            console.log("All Data for given ID:")
            console.log(chartObject);

            var metadataObject = demographicDataObject(data, selectIDValue);
            console.log("All Metadata for given ID:");
            console.log(metadataObject);

            var chartObjectSlice = sortsliceBarChart(data, selectIDValue);
            console.log("Top 10 data_values:")
            console.log(chartObjectSlice);

            // reset all html elements
            barID.html("");
            gaugeID.html("");
            bubbleID.html("");
            demogInfo.html("");
            // plot and create table functions
            initBarChartPlotly(data, selectIDValue);
            initGaugePlotly(data, selectIDValue);
            initBubbleChartPlotly(data, selectIDValue);
            initDemographicInfo(data, selectIDValue);
        });
    });
}
// need to call the function somewhere
init();
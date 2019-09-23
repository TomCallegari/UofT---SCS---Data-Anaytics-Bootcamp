
function populateDropdown(importedData) {
    
    var sampleNames = importedData.names,
    select = document.getElementById('selDataset');

    for (sample in sampleNames) {
        select.add(new Option(sampleNames[sample]));
    };

    return select
}

function filterSamples(importedData) {
    
    var dropdownMenu = d3.select('#selDataset');
    var sampleId = dropdownMenu.property('value');
    
    var samplesData = importedData.samples;

    function filterSamples(sample) {
        return sample.id === sampleId
    };

    return samplesData.filter(filterSamples);

};

function filterMetaData(importedData) {

    var dropdownMenu = d3.select('#selDataset');
    var sampleId = dropdownMenu.property('value');

    var metaData = importedData.metadata;

    function filterMeta(metaObject) {
        return metaObject.id === parseInt(sampleId)
    };

    return metaData.filter(filterMeta);

};

function getBarData(filteredSample) {

    otu_ids = []
    sample_values = []
    otu_labels = []

    for (var i = 0; i < filteredSample['0']['otu_ids'].length; i++) {

        id = filteredSample['0']['otu_ids'][i]
        otu_ids.push({otu_ids: id})

        values = filteredSample['0']['sample_values'][i]
        sample_values.push({sample_values: values})

        labels = filteredSample['0']['otu_labels'][i]
        otu_labels.push({otu_labels: labels})
        
    };

    newObj = []
    for (var i = 0; i < otu_ids.length; i++) {

        id = otu_ids[i]['otu_ids'].toString()
        values = sample_values[i]['sample_values']
        labels = otu_labels[i]['otu_labels']

        newObj.push({otu_id: `OTU ${id}`, sample_values: values, otu_labels: labels})
    };

    var sortedBysample_value = newObj.sort((a, b) => b.sample_values - a.sample_values);
    var slicedData = sortedBysample_value.slice(0, 10);
    
    return slicedData.reverse();
};

function plotsConstructor(importedData) {

    // Bar chart
    var filteredSample = filterSamples(importedData);
    var reversedData = getBarData(filteredSample);

    barTrace = {
        x: reversedData.map(object => object.sample_values),
        y: reversedData.map(object => object.otu_id),
        type: 'bar',
        orientation: 'h'
    };

    var barData = [barTrace];

    var barLayout = {
        title: 'OTU_ID & Sample_Values'
    }

    var barChart = d3.selectAll('#bar').node();

    Plotly.newPlot(barChart, barData, barLayout);

    // Bubble plot
    bubbleTrace = {
        x: filteredSample['0'].otu_ids,
        y: filteredSample['0'].sample_values,
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: filteredSample['0'].sample_values,
            color: filteredSample['0'].otu_ids,
            labels: filteredSample['0'].otu_labels
    }};
        
    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
        title: 'OTU_IDs & Sample_Values'
    }        

    var bubbleChart = d3.selectAll('#bubble').node();

    Plotly.newPlot(bubbleChart, bubbleData, bubbleLayout)

    // Gauge chart
    var meta = filterMetaData(importedData);

    var filteredMeta = meta['0']

    var gaugeData = [
        {
            domain: {x: [0, 1], y: [0, 1]},
            value: filteredMeta['wfreq'],
            title: { text: 'Weekly Wash Frequency'},
            type: 'indicator',
            mode: 'gauge+number+delta',
            gauge: {
                axis: { range: [null, 10] },
                steps: [
                    { range: [0, 5], color: 'lightgray' },
                    { range: [5, 10], color: 'gray'}
                    ]                  
                }
            }        
    ];

    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0}};

    var gaugeChart = d3.selectAll('#gauge').node();

    Plotly.newPlot(gaugeChart, gaugeData, gaugeLayout)

};

function tableConstructor(importedData) {

    var meta = filterMetaData(importedData);
    var filteredMeta = meta['0']

    buildTable(filteredMeta);

};

function buildTable(filteredMeta) {

    var tableData = Object.entries(filteredMeta)
    d3.select('tbody')
        .selectAll('tr')
        .data(tableData)
        .enter()
        .append('tr')
        .html(function(d) {
            return `<td>${d[0]}</td><td>${d[1]}</td>`
        })

};

function initPlots() {

    d3.json('../samples.json').then((importedData) => {

        populateDropdown(importedData);
        plotsConstructor(importedData);
        tableConstructor(importedData);

    });

};

d3.selectAll('#selDataset').on('change', updatePage)

function updatePage() {

    d3.json('../samples.json').then((importedData) => {

        plotsConstructor(importedData);     
        d3.select('tbody').html('')   
        tableConstructor(importedData);

    });
    
};

initPlots();

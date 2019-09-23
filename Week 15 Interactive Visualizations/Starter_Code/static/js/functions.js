
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
    
    var samplesData = importedData.samples  

    function filterSamples(sample) {
        return sample.id === sampleId
    }

    return samplesData.filter(filterSamples);

};

function getBarData(filteredSample) {

    // Loop through data twice to format as sortable/sliceable shape
    // then sort, slice, reverse the object and stringify otu_ids
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
        
    }

    newObj = []
    for (var i = 0; i < 79; i++) {
        id = otu_ids[i]['otu_ids'].toString()
        values = sample_values[i]['sample_values']
        labels = otu_labels[i]['otu_labels']

        newObj.push({otu_id: `OTU ${id}`, sample_values: values, otu_labels: labels})
    }

    var sortedBysample_value = newObj.sort((a, b) => b.sample_values - a.sample_values);
    var slicedData = sortedBysample_value.slice(0, 10);
    
    return slicedData.reverse();
};

function initPlots() {

    barTrace = {
       x: reversedData.map(object => object.sample_values),
       y: reversedData.map(object => object.otu_id),
       type: 'bar',
       orientation: 'h'
    };

    var barData = [barTrace];

    var barLayout = {
        title: 'Bar plot of Top 10 otu_ids & sample_values'
    }

   var barChart = d3.selectAll('#bar').node();

   Plotly.newPlot(barChart, barData, barLayout);

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
        title: 'Bubble plot of otu_ids & sample_values'
    }        

   var bubbleChart = d3.selectAll('#bubble').node();

   Plotly.newPlot(bubbleChart, bubbleData, bubbleLayout)
};

// Place d3 event listener

function updatePage() {

    sampleData = filterSamples(importedData);


};


// Test run
d3.json('../samples.json').then((importedData) {

    populateDropdown(importedData);
    
})
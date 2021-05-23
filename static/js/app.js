
// Step 1: Plotly
// Use the D3 library to read in samples.json.
const dataFile = "samples.json";

// Fetch the JSON data and console log it
d3.json(dataFile).then(function(data) {
    var metadata = data.metadata;
    var metaBox = d3.select("#sample-metadata");
    var dropdown = d3.select("select")
  
    dropdown.selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .attr("value", function(n, i) {
            return i;})
        .text(function(n) {
            return n;})
    
    function init() {
    // Meta Data
        Object.entries(metadata[0]).forEach(([key, value]) => {
            metaBox.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    //Bar Chart    
        var barData = [{
            x: data.samples[0].sample_values.slice(0,10).reverse(),
            y: data.samples[0].otu_ids.slice(0,10).map(ID => `OTU ${ID}`).reverse(),
            hovertext: data.samples[0].otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
                      
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
        };
                        
        Plotly.newPlot("bar", barData, barLayout);

    //Bubble Chart
        var bubbleData = [{
            x: data.samples[0].otu_ids,
            y: data.samples[0].sample_values,
            text: data.samples[0].otu_labels,
            mode: 'markers',
            marker: {
                size: data.samples[0].sample_values,
                color: data.samples[0].otu_ids,
              }
        }];
                    
        var bubbleLayout = {
            title: "Bacteria Cultures per Sample",
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    }        
  // On change to the DOM, call getData()
  d3.selectAll("#selDataset").on("change", optionChanged);

    // Function called by DOM changes
    function optionChanged() {
        var id = d3.event.target.value
        console.log(d3.event.target.value);

        // Meta Data
        metaBox.html("")
        Object.entries(metadata[id]).forEach(([key, value]) => {
            metaBox.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });    

        var xdata = data.samples[id].sample_values.slice(0,10).reverse();
        var ydata = data.samples[id].otu_ids.slice(0,10).map(ID => `OTU ${ID}`).reverse()
        var hoverdata = data.samples[id].otu_labels.slice(0,10).reverse()
        updateBar(xdata, ydata, hoverdata);

        var otu_id = data.samples[id].otu_ids;
        var sample_val = data.samples[id].sample_values;
        var otu_label = data.samples[id].otu_labels;
        updateBubble(otu_id, sample_val, otu_label);
    }

  
    // Bar - Update the restyled plot's values
    function updateBar(newx, newy, hoverdata) {
        Plotly.restyle("bar", "x" , [newx]);
        Plotly.restyle("bar", "y" , [newy]);
        Plotly.restyle("bar", "hovertext" , [hoverdata]);
    }

    // Bubble - Update the restyled plot's values
    function updateBubble(otu_id, sample_val, otu_label) {
        Plotly.restyle("bubble", "x" , [otu_id]);
        Plotly.restyle("bubble", "y" , [sample_val]);
        Plotly.restyle("bubble", "text" , [otu_label]);
        Plotly.restyle("bubble", "color" , [otu_id]);
        Plotly.restyle("bubble", "size" , [sample_val]);
    }

  init();
  
});


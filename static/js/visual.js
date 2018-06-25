var url = '/departmentlist';
//console.log(url);
var select = document.getElementById('chosen_dep')

Plotly.d3.json(url, function(error, response){

    var data = response;
    //console.log(data);
    for (var i=0; i< data.length; i++){
        var option = document.createElement('option');
        option.innerHTML = data[i];
        select.appendChild(option);
    }
    optionChanged(data[0]);
});

function optionChanged(department){

    var url1= `/history/${department}`;

    Plotly.d3.json(url1, function (error, response) {
        console.log(response);
        var trace = [{
        type: "bar",
        x: response['status'],
        y: response['count'],
        hoverinfo: 'label+percent+name'

        }];
        var layout = {
          title: 'Department Status',
          font:{
            family: 'Raleway, sans-serif'
          },
          showlegend: false,
          xaxis: {
            tickangle: -30
          },
          yaxis: {
            zeroline: false,
            gridwidth: 2
          },
          bargap :0.05
        };



        var BAR = document.getElementById('status');
        Plotly.newPlot(BAR, trace, layout);

            });


    var url2 = `/priority/${department}`;
    Plotly.d3.json(url2, function(error, response){
        console.log(response);
        //Create pie chart
            var trace = [{
        type: "pie",
        values: response['count'],
        labels: response['priority'],
        hoverinfo: 'label+percent'
    }];

    var PIE = document.getElementById('priority');
    Plotly.newPlot(PIE, trace);


    });

};



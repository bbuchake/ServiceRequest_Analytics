
var urlParams = new URLSearchParams(window.location.search);

//Get reference to Submit button
var $submitBtn = document.querySelector("#submit");
$submitBtn.addEventListener("click", handleSubmitButtonClick);

//Get reference to alerts
var $alertDiv = document.getElementById('alertDiv');
var $alerts = document.getElementById('alerts');

window.onload = function() {
    $alertDiv.style.display = 'none';
    console.log(req_priority);

    if(req_priority == undefined) {
        //Record is new
        document.getElementById('assignedToDiv').style.display = 'none';
        document.getElementById('markCompletedDiv').style.display = 'none';
        document.getElementById('totalPriorityDiv').style.display = 'none';
        //Hide donut chart div
    }
    else {
        //Record exists
        document.getElementById('assignedToDiv').style.display = 'block';
        document.getElementById('markCompletedDiv').style.display = 'block';
        document.getElementById('totalPriorityDiv').style.display = 'block';
        console.log(total_priority);
        
       
        //Enter a level between 1 and 5
        var level = total_priority;
        alert(total_priority);

        // Trig to calc meter point
        var degrees = 180-(level-1)*45;
        alert(degrees);
             radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
             pathX = String(x),
             space = ' ',
             pathY = String(y),
             pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'category',
           x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'speed',
            text: level,
            hoverinfo: 'text+name'},
          { values: [5,4,3,1,2, 15],
          rotation: 90,

          text: ['Very High', 'High', 'Medium', 'Low',
                    'Very Low',  ''],
          textinfo: 'text',
          textposition:'inside',      
          marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                 'rgba(210, 206, 145, .5)', 
                                 'rgba(255, 255, 255, 0)']},
          labels: ['4.5-5', '3.5-4.49', '2.5-3.49', '1.5-2.49', '1-1.49'],
          hoverinfo: 'label',
          hole: .5,
          type: 'pie',
          showlegend: false
        }];

        var layout = {
          shapes:[{
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                color: '850000'
              }
            }],
          title: 'Priority 1-5',
          height: 300,
          width: 350,
          xaxis: {type:'category',zeroline:false, showticklabels:false,
                     showgrid: false, range: [-1, 1]},
          yaxis: {type:'category',zeroline:false, showticklabels:false,
                     showgrid: false, range: [-1, 1]}
        };

        var gaugeDiv = document.getElementById('totalPriorityDiv');
        Plotly.newPlot(gaugeDiv, data, layout);

    }
}


function handleSubmitButtonClick() {
    var errorMessages = "Oh snap!";
    //Check whether radio buttons are clicked
    if(document.querySelector("input[name='requestorRadios']:checked") == null) {
        errorMessages = errorMessages + "<br/> You need to select a Requestor.";
    }
    if(document.querySelector("input[name='purposeRadios']:checked") == null) {
        errorMessages = errorMessages + "<br/> You need to select a Purpose.";
    }
    if(document.querySelector("input[name='hoursRadios']:checked") == null) {
        errorMessages = errorMessages + "<br/> You need to select Hours.";
    }
    //Check whether there were any errors
    if(errorMessages.length > 10)
    {
        //There were error messages
        $alerts.innerHTML = errorMessages;
        $alertDiv.style.display = 'block';
    }
    else
    {
        //No error messages
        $alertDiv.style.display = 'none';
        
        if(document.getElementById("markCompleted").checked) {
            document.getElementById('markCompletedHidden').disabled = true;
        }
        document.querySelector("#frmPriority").submit();
    }
    
    
}


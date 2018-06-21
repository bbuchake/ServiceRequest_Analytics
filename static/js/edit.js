
var urlParams = new URLSearchParams(window.location.search);

// Set serviceRequests to dataSet initially
var serviceRequest;

//Get reference to Submit button
var $submitBtn = document.querySelector("#submit");
$submitBtn.addEventListener("click", handleSubmitButtonClick);

//Get reference to alerts
var $alertDiv = document.getElementById('alertDiv');
var $alerts = document.getElementById('alerts');

window.onload = function() {
    $alertDiv.style.display = 'none';

    if(req_priority == undefined) {
        //Record is new
        document.getElementById('assignedToDiv').style.display = 'none';
        document.getElementById('markCompletedDiv').style.display = 'none';
    }
    else {
        //Record exists
        document.getElementById('assignedToDiv').style.display = 'block';
        document.getElementById('markCompletedDiv').style.display = 'block';
    }
}


function handleSubmitButtonClick() {
    var errorMessages = "Oh snap!";
    //Check whether radio buttons are clicked
    if(document.querySelector("input[name='requestorRadios']:checked").val() == undefined) {
        errorMessages = errorMessages + "<br/> You need to select a Requestor.";
    }
    if(document.querySelector("input[name='purposeRadios']:checked").val() == undefined) {
        errorMessages = errorMessages + "<br/> You need to select a Requestor.";
    }
    if(document.querySelector("input[name='hoursRadios']:checked").val() == undefined) {
        errorMessages = errorMessages + "<br/> You need to select Hours.";
    }
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
        //Get values of the radio buttons clicked
        var requestorRadios = document.querySelector("input[name='requestorRadios']:checked").val();
        var purposeRadios = document.querySelector("input[name='purposeRadios']:checked").val();
        var hoursRadios = document.querySelector("input[name='hoursRadios']:checked").val();
        //Send values to the flask endpoint
        //***************************************
    }
    
    
}
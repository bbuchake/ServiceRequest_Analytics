
var urlParams = new URLSearchParams(window.location.search);

// Set serviceRequests to dataSet initially
var serviceRequest = undefined;

//Get reference to Submit button
var $submitBtn = document.querySelector("#submit");
$submitBtn.addEventListener("click", handleSubmitButtonClick);

//Get reference to alerts
var $alertDiv = document.getElementById('alertDiv');
var $alerts = document.getElementById('alerts');

window.onload = function() {
    $alertDiv.style.display = 'none';
    //Check whether record is new or existing
    for(var i = 0; i < dataSet.length; i++) {
        if(dataSet[i]['number'] == urlParams.get('item_number'))
            serviceRequest = dataSet[i];
    }
    console.log(serviceRequest);
    //Set all values from Service Request object
    document.getElementById('itemNumber').innerHTML = serviceRequest['number'];
    document.getElementById('assignmentGroup').innerHTML = serviceRequest['assignment_group'];
    document.getElementById('categoryItem').innerHTML = serviceRequest['cat_item'];
    document.getElementById('requestedFor').innerHTML = serviceRequest['request_requested_for'];
    document.getElementById('state').innerHTML = serviceRequest['state'];
    document.getElementById('dueDate').innerHTML = serviceRequest['due_date'];

    if(serviceRequest['requestor'] == undefined) {
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
    if($("input[name='requestorRadios']:checked").val() == undefined) {
        errorMessages = errorMessages + "<br/> You need to select a Requestor.";
    }
    if($("input[name='purposeRadios']:checked").val() == undefined) {
        errorMessages = errorMessages + "<br/> You need to select a Requestor.";
    }
    if($("input[name='hoursRadios']:checked").val() == undefined) {
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
        var requestorRadios = $("input[name='requestorRadios']:checked").val();
        var purposeRadios = $("input[name='purposeRadios']:checked").val();
        var hoursRadios = $("input[name='hoursRadios']:checked").val();
        //Send values to the flask endpoint
        //***************************************
    }
    
    
}
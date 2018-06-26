
var urlParams = new URLSearchParams(window.location.search);

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
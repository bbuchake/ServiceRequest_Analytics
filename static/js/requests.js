
// Get references to the tbody element, input field and buttons
var $tbody = document.querySelector("tbody");
var $searchType = document.querySelector("#searchType");
var $searchInput = document.querySelector("#searchText");
var $searchBtn = document.querySelector("#search");

//Set number of records per page for pagination
var $records_per_page = document.querySelector("#recordsPerPage");
var records_per_page = $records_per_page.value;

// Set serviceRequests to dataSet initially
//var serviceRequests = dataSet;
//console.log(serviceRequests);
var dataSet;

//Initialize Page 1
var current_page = 1;
var max_page = 0;
var min_page = 0;

//Function for previous page
function prevPage() {
    if (current_page > 1) {
        current_page--;
        renderTable(current_page);
    }
}

function paginate(min_page, max_page) {
    //Declarations
    var li, link, x, $pages;

    //Get handle to ul
    $pages = document.querySelector("#pages");
    //Clear ul
    $pages.innerHTML = '';

    //Create li for previous button
    li = document.createElement("li"); //Create list item
    li.setAttribute("id", "pagePrev"); // add id
    li.setAttribute("class", "page-item"); //add class

    link = document.createElement("a"); //Create link
    link.setAttribute('class', 'page-link');//add class
    link.setAttribute('id', 'btn_prev'); //add id
    link.innerHTML = '<<';
    link.addEventListener("click", prevPage);

    li.appendChild(link);
    $pages.appendChild(li);

    link = undefined;
    li = undefined;

    //Create li(s) for pages
    for (x = min_page; x <= max_page; x++) {
        li = document.createElement("li"); //Create list item
        li.setAttribute("id", "page" + x); // add id
        li.setAttribute("class", "page-item"); //add class

        link = document.createElement("a"); //Create link
        link.setAttribute('class', 'page-link');//add class
        link.setAttribute('id', 'link' + x); //add id
        link.innerHTML = x; //add text
        
        link.addEventListener("click", function () {
            renderTable(this.innerHTML);
        }, false);


        li.appendChild(link);

        $pages.appendChild(li);

        link = undefined;
        li = undefined;

        }

    //Create li for next button
    li = document.createElement("li"); //Create list item
    li.setAttribute("id", "pageNext"); // add id
    li.setAttribute("class", "page-item") //add class

    link = document.createElement("a"); //Create link
    link.setAttribute('class', 'page-link');//add class
    link.setAttribute('id', 'btn_next'); //add id
    link.innerHTML = '>>';
    link.addEventListener("click", nextPage);

    li.appendChild(link);
    $pages.appendChild(li);

    link = undefined;
    li = undefined;
    
    
  }

// renderTable renders the serviceRequests to the tbody
function renderTable(page) {
    //Declarations
    var i;
    
    $tbody.innerHTML = "";

    //Check page number and decide min_page and max_page for pagination
    if (page % 10 > 0) {

        min_page = +(page - (page % 10)) + 1;
        max_page = +page + (10 - (page % 10));

        paginate(min_page, max_page);

        
    }
    else {

        min_page = page - 9;
        max_page = page;

        paginate(min_page, max_page);
    }
        
    current_page = page;

    //Activate control for active page
    $pageActive = document.querySelector("#page" + current_page);
    $pageActive.setAttribute("class", "page-item active");

    
    // Validate page
    if (current_page < 1) { current_page = 1; }
    if (current_page > numPages()) { current_page = numPages(); }

    for (i = (current_page-1) * records_per_page; i < (current_page * records_per_page) && i < serviceRequests.length; i++) {
        // Get get the current request object and its fields    
        var request = serviceRequests[i];
        //console.log(request);
        var fields = Object.keys(request);
        var rowIndex = 0;
        // Create a new row in the tbody, set the index to be 0
        
        var $row = $tbody.insertRow(rowIndex);
        for (var j = 0; j < fields.length; j++) {
            // For every field in the request object, create a new cell at set its inner text to be the current value at the current request's field      
            var field = fields[j];
            var $cell = $row.insertCell(j);
            if(j == 0) {
                //$cell.innerHTML = "<a href='edit.html?item_number=" + request[field] + "'>" + request[field] + "</a>";
                $cell.innerHTML = "<a href = \"/get/" + request[field] + "\" target=\"_blank\">" + request[field] + "</a>";
            }
            else
                $cell.innerText = request[field];
        }
        rowIndex++;   

    }

    if (current_page == 1) {
        document.querySelector('#pagePrev').setAttribute('class', 'page-item disabled');
    } else {
        document.querySelector('#pagePrev').setAttribute('class', 'page-item');
    }

    if (current_page == numPages()) {
        document.querySelector('#pageNext').setAttribute('class', 'page-item disabled');
    } else {
        document.querySelector('#pageNext').setAttribute('class', 'page-item');
    }
}

function handleSearchButtonClick() {

    // Format the user's search by removing leading and trailing whitespace, lowercase the string  
    var filterSearch = $searchInput.value.trim().toLowerCase();
    var searchType = $searchType.value;
    
    // Set serviceRequests to an array of all resquests whose "state" matches the filter  
    serviceRequests = dataSet.filter(function (reqObj) {
           
        var returnSearch = "";

        //Check Search Type and then filter
        switch(searchType)
        {
            case '1':
            	if(reqObj[0]) {
            		var reqNumber = reqObj[0].toLowerCase();
                	returnSearch = reqNumber;
                	}
                else 
                	returnSearch = reqNumber;
                	 break;
            case '2':
            	if(reqObj[1]) {
            	    var reqCatItem = reqObj[1].toLowerCase();
                    returnSearch = reqCatItem;
                }
                else 
                	returnSearch = reqNumber;
                 break;
            case '3':
            	if(reqObj[2]) {
            	    var reqState = reqObj[2].toLowerCase();
                	returnSearch = reqState;
                }
                else 
                	returnSearch = reqNumber;
                 break;
            case '4':
            	if(reqObj[3]) {
            		var reqAsgnGroup = reqObj[3].toLowerCase();
                	returnSearch = reqAsgnGroup;
                }
                else 
                	returnSearch = reqNumber;
                 break;
            case '5':
            	if(reqObj[4]) {
            	    var reqFor = reqObj[4].toLowerCase();
                	returnSearch =  reqFor;
                }
                else 
                	returnSearch = reqNumber;
                 break;
            case '6':
                if(reqObj[5]) {
                	var reqDueDate  = reqObj[5].toLowerCase();
            		returnSearch  = reqDueDate;
            	}
            	else 
                	returnSearch = reqNumber;
            	 break;
            default:
                returnSearch = reqNumber;
                break;
        }

        return returnSearch === filterSearch;
    });

    //Render table and initialize page
    renderTable(1);

}

function numPages() {
    return Math.ceil(serviceRequests.length / records_per_page);
}




//Function for next page
function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        renderTable(current_page);
    }
}



window.onload = function () {
    dataSet = serviceRequests;
    // Render the table for the first time on page load and initialize page
    renderTable(1);
};

//Event for handling the number of pages to be displayed per page
function updateRecordsPerPage() {
    records_per_page=$records_per_page.value;
    renderTable(1);
}

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);
$records_per_page.addEventListener("change", updateRecordsPerPage);

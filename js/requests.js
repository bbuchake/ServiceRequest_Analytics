// Get references to the tbody element, input field and buttons
var $tbody = document.querySelector("tbody");
var $searchType = document.querySelector("#searchType");
var $searchInput = document.querySelector("#searchText");
var $searchBtn = document.querySelector("#search");

//Set number of records per page for pagination
var $records_per_page =document.querySelector("#recordsPerPage");
var records_per_page = $records_per_page.value;

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);
$records_per_page.addEventListener("change", updateRecordsPerPage);

// Set ufoSightings to dataSet initially
var ufoSightings = dataSet;

//Initialize Page 1
var current_page = 1;
var max_page = 0;
var min_page = 0;

window.onload = function() {
    // Render the table for the first time on page load and initialize page
    renderTable(1);
};
//Event for handling the number of pages to be displayed per page
function updateRecordsPerPage() {
    records_per_page=$records_per_page.value;
    renderTable(1);
}


// renderTable renders the ufoSightings to the tbody
function renderTable(page) {
    $tbody.innerHTML = "";

    //Check page number and decide min_page and max_page for pagination
    if(page % 10 > 0){

        min_page = +(page - (page % 10)) + +1;
        max_page = +page + +(10 - (page % 10));

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
    if (current_page < 1) current_page = 1;
    if (current_page > numPages()) current_page = numPages();

    for (var i = (current_page-1) * records_per_page; i < (current_page * records_per_page) && i < dataSet.length; i++) {
        // Get get the current ufo object and its fields    
        var ufo = ufoSightings[i];
        var fields = Object.keys(ufo);
        var rowIndex = 0;
        // Create a new row in the tbody, set the index to be 0
        
        var $row = $tbody.insertRow(rowIndex);
        for (var j = 0; j < fields.length; j++) {
            // For every field in the ufo object, create a new cell at set its inner text to be the current value at the current ufo's field      
            var field = fields[j];
            var $cell = $row.insertCell(j);
            $cell.innerText = ufo[field];
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
    console.log('Inside click');
    // Format the user's search by removing leading and trailing whitespace, lowercase the string  
    var filterSearch = $searchInput.value.trim().toLowerCase();
    var searchType = $searchType.value;
    console.log('Filter Search: ' + filterSearch);
    console.log('Search Type: ' + searchType);
    
    // Set ufoSightings to an array of all ufos whose "state" matches the filter  
    ufoSightings = dataSet.filter(function (ufo) {
        var ufoDateTime = ufo.datetime.toLowerCase();
        var ufoCountry = ufo.country.toLowerCase();
        var ufoState = ufo.state.toLowerCase();
        var ufoCity = ufo.city.toLowerCase();
        var ufoShape = ufo.shape.toLowerCase();
        
        var returnSearch = "";

        //Check Search Type and then filter
        switch(searchType)
        {
            case '1':
                returnSearch = ufoDateTime;
                break;
            case '2':
                returnSearch = ufoCountry;
                break;
            case '3':
                returnSearch = ufoState;
                break;
            case '4':
                returnSearch = ufoCity;
                break;
            case '5':
                returnSearch =  ufoShape;
                break;
            default:
                returnSearch = ufoDateTime;
                break;
        }

        return returnSearch === filterSearch;
    });

    //Render table and initialize page
    renderTable(1);

}

function numPages() {
    return Math.ceil(ufoSightings.length / records_per_page);
}


//Function for previous page
function prevPage()
{
    if (current_page > 1) {
        current_page--;
        renderTable(current_page);
    }
}

//Function for next page
function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        renderTable(current_page);
    }
}
function paginate(min_page, max_page) {

    //Get handle to ul
    var $pages = document.querySelector("#pages");
    //Clear ul
    $pages.innerHTML = '';

    //Create li for previous button
    var li = document.createElement("li"); //Create list item
    li.setAttribute("id", "pagePrev"); // add id
    li.setAttribute("class", "page-item") //add class

    var link = document.createElement("a"); //Create link
    link.setAttribute('class', 'page-link');//add class
    link.setAttribute('id', 'btn_prev'); //add id
    link.innerHTML = '<<';
    link.addEventListener("click", prevPage);

    li.appendChild(link);
    $pages.appendChild(li);

    link = undefined;
    li = undefined;

    //Create li(s) for pages
    for(x=min_page;x<=max_page;x++) {
        var li = document.createElement("li"); //Create list item
        li.setAttribute("id", "page" + x); // add id
        li.setAttribute("class", "page-item") //add class

        var link = document.createElement("a"); //Create link
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
    var li = document.createElement("li"); //Create list item
    li.setAttribute("id", "pageNext"); // add id
    li.setAttribute("class", "page-item") //add class

    var link = document.createElement("a"); //Create link
    link.setAttribute('class', 'page-link');//add class
    link.setAttribute('id', 'btn_next'); //add id
    link.innerHTML = '>>';
    link.addEventListener("click", nextPage);

    li.appendChild(link);
    $pages.appendChild(li);

    link = undefined;
    li = undefined;
    
    
  }

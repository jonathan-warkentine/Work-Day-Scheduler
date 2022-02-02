today = moment();
var scheduleStartTime = 9;
var scheduleEndTime = 16;
var localStorageAvailable = localStorage.getItem("savedSchedule") != null; //boolean that indicates whether content has been saved to the local storage

//set up our page
$("#currentDay").text(today.format("dddd, MMMM Do, YYYY")); //set the date in the header
populatePage();

function populatePage() {    
    for (let i=scheduleStartTime; i<=scheduleEndTime; i++){
    
    let hour = moment(0).hour(i).format("h:mm A");

    let newTimeBlockEl = $("#template-time-block").clone(); //cloning a new time-block element to populate to our page, modified/customized below
    newTimeBlockEl.attr("style", "display: flex"); //our template time-block is hidden, but we want to see our clones
    newTimeBlockEl.attr("id", "time-block-"+i);

    // Set the hour element in our new time-block
    

    // Set the textarea element in our new time-block
    let textareaPlaceholder = hour + " \- " + (moment(0).hour(i+1).format("h:mm A"));
    newTimeBlockEl.children("textarea").attr("placeholder", textareaPlaceholder);
    newTimeBlockEl.children("textarea").attr("id", "schedule-item-"+i);
    
    //assign the appropriate class depending on whether the time block is in the future, past, or present for today
    assignElementClasses (newTimeBlockEl, i);
    setElementText(newTimeBlockEl.children(".hour"), hour);
    
    if(localStorageAvailable){ // If local storage is available, populate any previously saved entries for this time slot from local storage
        writeFromStorage(newTimeBlockEl.children("textarea"), "savedSchedule", i);
    }

    //append our new time-block to the page
    $("#time-block-container").append(newTimeBlockEl); 
    }
}

function writeFromStorage (element, localStorageID, index) { //writes whatever is in the local storage object at a given index to the provided element
    let savedSchedule = JSON.parse(localStorage.getItem(localStorageID));
    element.val(savedSchedule[index-scheduleStartTime].item);
}

function assignElementClasses (element, i) { //checks to see if a timeblock is for a past, present, or future timeblock and sets the class accordingly
    if (moment().hour()>i) {
        element.children("textarea").addClass("past");
    }
    else if (moment().hour()==i) {
        element.children("textarea").addClass("present");
    }
    else {
        element.children("textarea").addClass("future");
    }
}

function setElementText (element, text) {
    element.text(text); 
}

function savePage () {
    let unsavedSchedule = [];

    for (let i=scheduleStartTime; i<=scheduleEndTime; i++){
        let f = "#schedule-item-"+i;

        let item = document.querySelector(f).value;
        let itemObject = {
            hour: i,
            item: item
        };
        unsavedSchedule.push(itemObject);
    }
    localStorage.setItem("savedSchedule", JSON.stringify(unsavedSchedule));
}

function clearStorage () {
    localStorage.removeItem("savedSchedule");
    location.reload();
}

// U S E R     I N P U T S
$("textarea").on("keypress", function(event){ //if the user hits "Enter", save what's on the page
    if (event.key === "Enter") { 
        event.preventDefault(); //makes sure the "Enter" button does not take the user to a new line but just saves their work
        savePage();
    }
});

$(".saveBtn").on("click", savePage); //if the user hits the save button, saves what's on the page
$("#clear-storage-btn").on("click", clearStorage); //if the user selects the "clear schedule" button, clears the local storage





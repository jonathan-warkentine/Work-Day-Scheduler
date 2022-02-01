today = moment();
var scheduleStartTime = 9;
var scheduleEndTime = 16;

$("#currentDay").text(today.format("dddd, MMMM Do, YYYY")); //set the date in the header
populatePage();

function populatePage() {    
    for (let i=scheduleStartTime; i<=scheduleEndTime; i++){
    
    let hour = moment(0).hour(i).format("h:mm A");

    let newTimeBlockEl = $("#template-time-block").clone(); //cloning a new time-block element to populate to our page, modified/customized below
    newTimeBlockEl.attr("style", "display: flex"); //our template time-block is hidden, and we want to see our clones
    newTimeBlockEl.attr("id", "time-block-"+i);

    // Set the hour element in our new time-block
    newTimeBlockEl.children(".hour").text(hour); 

    // Set the textarea element in our new time-block
    let textareaPlaceholder = hour + " \- " + (moment(0).hour(i+1).format("h:mm A"));
    newTimeBlockEl.children("textarea").attr("placeholder", textareaPlaceholder);
    newTimeBlockEl.children("textarea").attr("id", "schedule-item-"+i);
    
    //assign the appropriate class depending on whether the time block is in the future, past, or present for today
    if (moment().hour()>i) {
        newTimeBlockEl.children("textarea").attr("class", "past description col-9 border");
    }
    else if (moment().hour()==i) {
        newTimeBlockEl.children("textarea").attr("class", "present description col-9 border");
    }
    else {
        newTimeBlockEl.children("textarea").attr("class", "future description col-9 border");
    }
    
    if(localStorage.getItem("savedSchedule")){ // If available, populate any previously saved entries for this time slot from local storage
        let savedSchedule = JSON.parse(localStorage.getItem("savedSchedule"));
        for (let j=0; j<=scheduleEndTime-scheduleStartTime; j++){
            if (j+scheduleStartTime==i) {
                newTimeBlockEl.children("textarea").val(savedSchedule[j].item);
            }
        }

    }

    //append our new time-block to the page
    $("#time-block-container").append(newTimeBlockEl); 
    }
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

// Saving user inputs:
$("textarea").on("keypress", function(event){ //if the user hits "Enter", save what's on the page
    if (event.key === "Enter") { 
        event.preventDefault(); //makes sure the "Enter" button does not take the user to a new line but just saves their work
        savePage();
    }
});

$(".saveBtn").on("click", savePage); //if the user hits the save button, saves what's on the page
$("#clear-storage-btn").on("click", clearStorage);





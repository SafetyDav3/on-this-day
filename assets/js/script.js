//global variables
var paraContainer = document.querySelector(".parallax-container")
var eventsEl = document.getElementById("hist-events")
var birthsEl = document.getElementById("famous-births")
var deathsEl = document.getElementById("famous-deaths")
var dateEl = document.getElementById("date-picker")
var dateForm = document.getElementById("date-form")
var saveDateBtn = document.getElementById("save-date-btn")
var savedDatesList = document.getElementById("saved-dates")

$("#date-picker").datepicker({
  changeMonth: true,
  showButtonPanel: true,
  format: "mm-dd",
  monthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
});

//click handler for saved date
var getSavedDateData = function(event) {
  var dateString = event.target.innerText
  var selectedMonth = dateString.substr(0, 2)
  var selectedDay = dateString.substr(3, 2)
  getNasaData(selectedMonth, selectedDay)
}

//function to generate button for saved dates
var generateSavedDateBtn = function(dateString) {
  var newListItem = document.createElement("li")
  var newDateBtn = document.createElement("button")
  newDateBtn.setAttribute("type", "button")
  newDateBtn.setAttribute("class", "btn-large waves-effect waves-light teal lighten-1")
  newDateBtn.innerText = dateString
  newDateBtn.addEventListener("click", getSavedDateData)
  newListItem.appendChild(newDateBtn)
  savedDatesList.appendChild(newListItem)
}

//function to load saved dates on page load
var loadDates = function() {
  var loadedDates = localStorage.getItem("SavedDates")
  if (!loadedDates) {
    return
  }
  loadedDates = JSON.parse(loadedDates)
  for (var i = 0; i < loadedDates.length; i++) {
      generateSavedDateBtn(loadedDates[i])
  }
}

var animateSavedDates = function() {
  $("#drop-btn").effect("shake", 600)
};

//function to save date as a button in dropdown and in local storage
var saveDate = function(event) {
  var dateString = dateEl.value
  if (!dateString) {
    return
  }
  var savedDates = localStorage.getItem("SavedDates")
  if (!savedDates) {
    generateSavedDateBtn(dateString);
    localStorage.setItem("SavedDates", JSON.stringify([dateString]));
    animateSavedDates();
    return;
  }
  savedDates = JSON.parse(savedDates)
  for (var i = 0; i < savedDates.length; i++) {
    if (dateString == savedDates[i]) {
        animateSavedDates();
        return;
      }
  }
  generateSavedDateBtn(dateString);
  animateSavedDates();
  savedDates.push(dateString);
  localStorage.setItem("SavedDates", JSON.stringify(savedDates));
};

//function that sorts arrays to a random order
var randomizeArray = function(array) {
  var randomizedArr = array
  for(let i = randomizedArr.length-1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = randomizedArr[i]
    randomizedArr[i] = randomizedArr[j]
    randomizedArr[j] = temp
  }
  return randomizedArr
}

//displays NASA pic/link and desc
var displayNasaData = function(nasaData) {
  var nasaEl = document.querySelector(".nasaPic")
  nasaEl.remove()
  var newNasaEl = document.createElement('div')
  newNasaEl.setAttribute('class', 'nasaPic')
  var nasaUrl = nasaData.url.substr(8, 13)
  if (nasaUrl == "apod.nasa.gov") {
    var nasaImage = document.createElement('img')
    nasaImage.setAttribute("src", nasaData.url)
    newNasaEl.appendChild(nasaImage)
  }
  else {
    var nasaLink = document.createElement('a')
    nasaLink.setAttribute("href", nasaData.url)
    nasaLink.setAttribute("target", "_blank")
    nasaLink.innerText = "Click Me!"
    newNasaEl.appendChild(nasaLink)
  }
  var nasaDesc = document.createElement('p')
  nasaDesc.innerText = nasaData.explanation
  newNasaEl.appendChild(nasaDesc)
  paraContainer.appendChild(newNasaEl)
}

//displays event, birth and death data
var displayDateData = function(dateData) {
  eventsEl.innerHTML = ""
  birthsEl.innerHTML = ""
  deathsEl.innerHTML = ""
  var eventsArr = randomizeArray(dateData.data.Events)
  var birthsArr = randomizeArray(dateData.data.Births)
  var deathsArr = randomizeArray(dateData.data.Deaths)
  for (let i = 0; i < 5; i++) {
    let newEvent = document.createElement("div")
    let newBirth = document.createElement("div")
    let newDeath = document.createElement("div")
    newEvent.innerHTML = eventsArr[i].html
    newBirth.innerHTML = birthsArr[i].html
    newDeath.innerHTML = deathsArr[i].html
    insertTarget(newEvent.querySelectorAll("a"))
    insertTarget(newBirth.querySelectorAll("a"))
    insertTarget(newDeath.querySelectorAll("a"))
    eventsEl.appendChild(newEvent)
    birthsEl.appendChild(newBirth)
    deathsEl.appendChild(newDeath)
  }
}

var insertTarget = function(nodeList) {
  for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].setAttribute("target", "_blank")
  }
}

//api call for event, birth and death data
var getDateData = function (month, day) {
  fetch(
    `https://octoproxymus.herokuapp.com?secret=walrus&url=${encodeURIComponent(
      `https://today.zenquotes.io/api/${month}/${day}`
    )}`
  )
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (dateData) {
      console.log(dateData);
      displayDateData(dateData);
    });
};

//api call for APOD for specific date from NASA api
var getNasaData = function (selectedMonth, selectedDay) {
  fetch(
    `https://api.nasa.gov/planetary/apod?date=2021-${selectedMonth}-${selectedDay}&api_key=3Jkz68futt7JqR6rwvf60CmRxO3fHkW5mgA7NQSK`
  )
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (nasaData) {
      console.log(nasaData);
      displayNasaData(nasaData)
      getDateData(selectedMonth, selectedDay);
    });
};

var dateSubmitHandler = function(event) {
  event.preventDefault()
  var dateString = dateEl.value
  if (!dateString) {
    return
  }
  var selectedMonth = dateString.substr(0, 2);
  var selectedDay = dateString.substr(3, 2);
  var footer = document.querySelector(".page-footer")
  footer.style.position = "relative"
  getNasaData(selectedMonth, selectedDay);
};

$(".dropdown-trigger").dropdown({ hover: false });

//event listeners for getting date info and saving date info
dateForm.addEventListener('submit', dateSubmitHandler)
saveDateBtn.addEventListener("click", saveDate)

//function call to load saved dates
loadDates()

//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
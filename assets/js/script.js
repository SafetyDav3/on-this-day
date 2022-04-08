$('#date-picker').datepicker({
  changeMonth: true,
  showButtonPanel: true,
  format: 'mm-dd'
})

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
    });
};

//api call for APOD for specific date from NASA api
var getNasaData = function () {
  var selectedMonth = 10;
  var selectedDay = 06;
  console.log(selectedMonth, selectedDay);
  fetch(
    `https://api.nasa.gov/planetary/apod?date=2021-${selectedMonth}-${selectedDay}&api_key=3Jkz68futt7JqR6rwvf60CmRxO3fHkW5mgA7NQSK`
  )
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (nasaData) {
      console.log(nasaData);
      getDateData(selectedMonth, selectedDay);
    });
};

getNasaData();

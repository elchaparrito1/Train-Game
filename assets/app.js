  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCD-bXwI2CHnf4yPIRZDQYBisU7zVRASsk",
    authDomain: "train-data-51d6e.firebaseapp.com",
    databaseURL: "https://train-data-51d6e.firebaseio.com",
    projectId: "train-data-51d6e",
    storageBucket: "train-data-51d6e.appspot.com",
    messagingSenderId: "324556144543"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var train;
  var destination;
  var firstTime;
  var frequency;
  var formFilled = false;

  $("#submit-btn").on("click", function(event) {

    event.preventDefault();

  var train = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

  console.log(train);
  console.log(destination);
  console.log(firstTime);
  console.log(frequency);

  if (train === "" || destination === "" || firstTime === "" || frequency === "") {
    alert("Please fill in all information");
    return formFilled = false;
  } else {

  database.ref().push({
      train: train,
      destination: destination,
      frequency: frequency,
      time: firstTime,
      // dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // console.log(database.val().train);
    // console.log(database.val().destination);
    // console.log(database.val().time);
    // console.log(database.val().frequency);

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
    }
  });

  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

    var train = childSnapshot.val().train;
    var destination = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;

    var tFrequency = frequency;
    console.log(tFrequency);
 // First Time (pushed back 1 year to make sure it comes before current time)
 var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

   // Current Time
   var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
   // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  
   // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);
  
   // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
   // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
  // var timePretty = moment.unix(nextTrain).format("HH:mm");
  var timePretty = moment(nextTrain).format("HH:mm");

    $(".t-body").css("text-align", "center");
    $("tbody").append(
        "<tr>"
        + "<td>" + train + "</td>"
        + "<td>" + destination + "</td>"
        + "<td>" + frequency + "</td>"
        + "<td>" + timePretty + "</td>"
        + "<td>" + tMinutesTillTrain + "</td>"
    );

  });

  function refreshPage(){
    window.location.reload();
}

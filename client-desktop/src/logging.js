const remote = require('electron').remote;

// Define duration in minutes
const REPEAT_EVERY_DURATION = 1;

function notifyAtNextDuration (duration) {
  var now = new Date();
  var msTilNextPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), nextPeriod(duration, now.getMinutes()), 0, 0) - now;

  setTimeout(function(){
    document.getElementById('waiting').style.display = 'none';
    document.getElementById('logging').style.display = 'block';
    notifyMe();
    repeatNotifications(duration);
  }, msTilNextPeriod);
}

function repeatNotifications (durationInMin) {
  setInterval(function() {
    document.getElementById('waiting').style.display = 'none';
    document.getElementById('logging').style.display = 'block';
    notifyMe();
  }, durationInMin * 60 * 1000)
}

function nextPeriod (duration, currentMinutes) {
  return (duration * (parseInt(currentMinutes / duration) + 1));
}

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Let's check whether notification permissions have already been granted

    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
    
    notification.onclick = function () {
      parent.focus();
      var window = remote.getCurrentWindow();
      window.show();
      document.getElementById('activity').focus();
    };
  } else if (Notification.permission !== "denied") {
    // Otherwise, we need to ask the user for permission
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

function hideLogging() {
  document.getElementById('waiting').style.display = 'block';
  document.getElementById('logging').style.display = 'none';
}

function submitLog() {
  const activityInput = document.getElementById('activity');

  const activity = activityInput.value;
  activityInput.value = '';

  // TODO: API call to submit log
  sendActivity(activity)

  hideLogging();
}

function sendActivity(message) {

  console.log('fetching')
  fetch(
    "http://localhost:3000/logging",
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ message })
    }
  );

}

notifyAtNextDuration(REPEAT_EVERY_DURATION);

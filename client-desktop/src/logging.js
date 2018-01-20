const remote = require('electron').remote;

function notifyAtNextDuration (duration) {
  var now = new Date();
  var msTilNextPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), nextPeriod(duration, now.getMinutes()), 0, 0) - now;

  setTimeout(function(){
    changeDisplay('waiting', 'none');
    changeDisplay('logging', 'block');
    notifyMe();
    repeatNotifications(duration);
  }, msTilNextPeriod);
}

function repeatNotifications (durationInMin) {
  setInterval(function() {
    changeDisplay('waiting', 'none');
    changeDisplay('logging', 'block');
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
        var notification = new Notification("Time to log!");
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

function submitLog() {
  const activityInput = document.getElementById('activity');

  const activity = activityInput.value;
  activityInput.value = '';

  sendActivity(activity)

  changeDisplay('logging', 'none');
  changeDisplay('logged', 'block');

  // Auto-hide window after two (?) seconds
  // TODO: if user has switched to review screen, don't autohide
  var window = remote.getCurrentWindow();
  setTimeout(() => {
    window.hide();

    // Once the window is hidden, go back to waiting screen
    changeDisplay('logged', 'none');
    changeDisplay('waiting', 'block');
  }, 2000);
}

function sendActivity(message) {
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

function changeDisplay(elementId, newDisplay) {
  document.getElementById(elementId).style.display = newDisplay;
}


fetch('http://localhost:3000')
  .then((response) => response.json())
  .then((response) => {
    notifyAtNextDuration(response.timeInterval);
  })
  .catch((err) => console.warn(err));

/*************************************************
 *         Plasma Robotics  Scouting App         *
 *          Default Application Scripts          *
 ************************************************/

 /* Helper Functions */
 function saveID(value) {
  localStorage.setItem("scoutID", value);
  location.reload();
}


/* Startup Scripts */
if (localStorage.getItem("scoutID")) {
  if (window.location.href.includes("?") === true) {
    if (window.location.href.includes("scoutID") === false) {
      window.location.href = window.location.href + "&scoutID=" + localStorage.getItem("scoutID");
    }
  } else {
    window.location.href = window.location.href + "?scoutID=" + localStorage.getItem("scoutID");
  }
}

  if (document.getElementById("dataEntry") != null) {
    document.getElementById("dataEntry").setAttribute('action', window.location.href);
  }
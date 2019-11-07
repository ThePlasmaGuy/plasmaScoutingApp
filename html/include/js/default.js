/*************************************************
 *         Plasma Robotics  Scouting App         *
 *          Default Application Scripts          *
 ************************************************/

 /* Helper Functions */
 function saveID(value) {
  localStorage.setItem("scoutID", value);
  pageURL = new URL(window.location.href);
  pageURL.searchParams.set("scoutID", value);
  window.location.href = pageURL.toString();
 }


/* Startup Scripts */
if (localStorage.getItem("scoutID")) {
  pageURL = new URL(window.location.href);
  if (pageURL.searchParams.get("scoutID") === null) {
    pageURL.searchParams.set("scoutID", localStorage.getItem("scoutID"));
    window.location.href = pageURL.toString();
  }
}

if (document.getElementById("dataEntry") != null) {
  document.getElementById("dataEntry").setAttribute('action', window.location.href);
}
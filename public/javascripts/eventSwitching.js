function switchElement(id, percentage) {
   
   var element = document.getElementById(id);   
   var power = document.getElementById(percentage).value;
   var checked = element.checked;
   var elementNumber;
   var elementState;
   var xhttp = new XMLHttpRequest();


   // set element number to send in request
   elementNumber = id.slice(-1);
   
   if (!checked) {
      //  Power being turned off for this element, set power to 0 and continue
      power = 0;
   } else {
      // power being turned on.  Must turn off all other checkboxes.  Server will shut down the rpi elements for us.
      if (element == document.getElementById("Element1")){
         // turning on element one so turn off element2.
         document.getElementById("Element2").checked = false;
      } else {
         // turn off element1.
         document.getElementById("Element1").checked = false;
      }
   }

   // use AJAX to send REST request to turn on or off.
   xhttp.open("POST", "http://192.168.1.24:3000/api/element/" + elementNumber + "/" + power, true);
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   xhttp.send("");

}

function switchPump(id) {
   
   var pump = document.getElementById(id);   
   var checked = pump.checked;
   var pumpNumber;
   var pumpState;
   var xhttp = new XMLHttpRequest();

   // set pump number to send in request
   pumpNumber = id.slice(-1);

   // Save next state as variable to submit with request
   if (checked) {
   	pumpState = 1;
   } else {
   	pumpState = 0;
   }

   // use AJAX to send REST request to turn on or off.
   xhttp.open("POST", "http://192.168.1.24:3000/api/pump/" + pumpNumber + "/" + pumpState, true);
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   xhttp.send("");
}

function updateTemps() {
   var xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // response success, conver to array for each item
         var tempList = [];
         var parsed = JSON.parse(this.responseText);

         console.log(parsed[0]);

         // update each page
         document.getElementById("temp1").innerHTML = parsed[0].temp;
         document.getElementById("temp2").innerHTML = parsed[1].temp;
      }
   }

   // get temps from service
   xhttp.open("GET", "http://192.168.1.24:3000/api/temp");
   xhttp.setRequestHeader("Content-type", "application/JSON");
   xhttp.send("");

   

}

function convertToC(tempF) {
    var fTempVal = parseFloat(tempF);
    var cTempVal = (fTempVal - 32) * (5 / 9);    
    return cTempVal;
}

function convertToF(tempC) {
    var cTempVal = parseFloat(tempC);
    var fTempVal = (cTempVal * (9 / 5)) + 32;    
    return fTempVal;
}

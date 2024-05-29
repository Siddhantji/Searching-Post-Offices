let ip;
let lat;
let lon;
let dateTime;
let timeZone;
let postCode;
let city;
let region;
let list=[];
let msg;
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      ip = data.ip;
      document.getElementById("curretnIp").textContent = data.ip;
    })
    .catch((error) => {
      console.error("Error fetching IP:", error);
    });
  //btn
});

function display() {
  document.getElementById("main").style.display ="none";
  document.getElementById("display").style.display ="";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      lon = position.coords.longitude;
      lat = position.coords.latitude;
      fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=41fd50fa61c444b5ab15c1501f0abfd1`
      )
        .then((resp) => resp.json())
        .then((result) => {
          console.log(result.results[0]);

          console.log(timeZone);
          if (result.results[0].timezone.name) {
            let chicago_datetime_str = new Date().toLocaleString("en-US", {
              timeZone: result.results[0].timezone.name,
            });
            dateTime = chicago_datetime_str;
            console.log(chicago_datetime_str);
            region = result.results[0].country_code;

            city = result.results[0].city;
            postCode = result.results[0].postcode;
            timeZone = result.results[0].timezone.name;
            fetch(`https://api.postalpincode.in/pincode/${postCode}`)
              .then((response) => response.json())
              .then((results) => {msg= results[0].Message;
                const arr = results[0].PostOffice;
                Show(arr);
              });
            
          } else {
            console.log("No location found");
          }
        });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function Show(arr) {
  list = arr;
  document.getElementById("ip").innerHTML += ip;
  document.getElementById("lat").innerHTML += lat;
  document.getElementById("lon").innerHTML += lon;
  document.getElementById("city").innerHTML += city;
  document.getElementById("reg").innerHTML += region.toUpperCase();
  document.getElementById("dt").innerHTML += dateTime;
  document.getElementById("tz").innerHTML += timeZone;
  document.getElementById("pin").innerHTML += postCode;
  document.getElementById("msg").innerHTML += msg;
  const map = document.getElementById("map");
  map.innerHTML = "";
  map.innerHTML = `
    <iframe src="https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed" width="1390" height="677" frameborder="0" style="border:0"></iframe>

  `;
  
  arrayShow(list);
}
function arrayShow(brr){
  let container = document.getElementById("container");
  container.innerHTML = "";
  brr.forEach(element => {
    container.innerHTML+=`
    <div class="border">
    <h3>Name: ${element.Name}</h3>
    <h3>Branch Type: ${element.BranchType}</h3>
    <h3>Delivery Status: ${element.DeliveryStatus}</h3>
    <h3>District: ${element.District}</h3>
    <h3>Division: ${element.Division}</h3>
    </div>
    `
  });
}


document.getElementById("offices").addEventListener("input",function(e) {
  let a = document.getElementById("offices").value.toLowerCase();
  let search = list.filter((element) => {
    if (element.Name.toLowerCase().includes(a)){
      return element;
    }
  })
  arrayShow(search);
});
const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.getElementById("sun-rise"),
    sunSet = document.getElementById("sun-set"),
    humidity = document.getElementById("humidity"),
    visibility = document.getElementById("visibility"),
    humidityStatus = document.getElementById("humidity-status"),
    airQuality = document.getElementById("air-quality"),
    airQualityStatus = document.getElementById("air-quality-status"),
    visibilityStatus = document.getElementById("visibility-status"),
    weatherCards =  document.getElementById("weather-cards"), // Corrected the ID here
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.getElementById("search"),
    search = document.getElementById("sea")
    




let currentCity = "";
let currentUnit = "C";
let hourlyOrWeek = "Week";


function getDateTime(){
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();

setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        currentCity = data.city;  // Corrected to use 'city' instead of 'currentCity'
        getWeatherData(data.city, currentUnit, hourlyOrWeek);
    });
}

getPublicIp();

function getWeatherData(city, unit, hourlyOrWeek) {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`, {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        let today = data.currentConditions;
        if (unit === "C") {
            temp.innerText = today.temp;
        } else {
            temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = "perc -" + today.precip + "%";
        uvIndex.innerText = today.uvindex;
        windSpeed.innerText = today.windspeed;
        humidity.innerText = today.humidity + "%";
        visibility.innerText = today.visibility;
        airQuality.innerText = today.winddir;
        sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
        sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
        measureUvIndex(today.uvindex);
        updateHumidityStatus(today.humidity);
        updateVisibilityStatus(today.visibility);
        updateAirQualityStatus(today.winddir);
        mainIcon.src = getIcon(today.icon);
        changeBackground(today.icon)
        if (hourlyOrWeek === "hourly") {
            updateForecast(data.days[0].hours, unit, "day");
        } else {
            updateForecast(data.days, unit, "week");
        }
    })
    .catch((err) => {
        alert("city not found in our database")
    })
}

function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureUvIndex(uvindex) {
    if (uvindex <= 2) {
        uvText.innerText = "Low";
    } else if (uvindex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvindex <= 7) {
        uvText.innerText = "High";
    } else if (uvindex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

function updateVisibilityStatus(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 1.6) { // Fixed incorrect conditions
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 3.5) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 11.3) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

function updateAirQualityStatus(airQuality) {
    if (airQuality <= 50) {
        airQualityStatus.innerText = "Good👌";
    } else if (airQuality <= 100) {
        airQualityStatus.innerText = "Moderate😐";
    } else if (airQuality <= 150) {
        airQualityStatus.innerText = "Unhealthy For Sensitive Groups😷";
    } else if (airQuality <= 200) {
        airQualityStatus.innerText = "Unhealthy😷";
    } else if (airQuality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
        airQualityStatus.innerText = "Hazardous😱";
    }
}

function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
    } else {
        return "https://i.ibb.co/1nxNGHL/10.png";
    }
}

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()];
}
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return` ${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

// function getHour(time) {
//     let [hour, minute] = time.split(":");
//     let ampm = hour >= 12 ? "PM" : "AM";
//     hour = hour % 12 || 12;
//     return `${hour}:${minute} ${ampm}`;
// }

function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = type === "day" ? 24 : 7;

    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");

        let dayName = type === "week" ? getDayName(data[day].datetime) : getHour(data[day].datetime);
        let dayTemp = data[day].temp;
        if (unit === "F") {
            dayTemp = celciusToFahrenheit(dayTemp);
        }
        let iconCondition = data[day].icon;
        let iconsrc = getIcon(iconCondition);
        let tempUnit = unit === "F" ? "°F" : "°C";

        card.innerHTML = `<h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
                <img src="${iconsrc}" alt="">
            </div>
            <div class="day-temp">
                <h2 class="temp">${dayTemp}</h2>
                <span class="temp-unit">${tempUnit}</span>
            </div>`;
        weatherCards.appendChild(card);
        day++;
    }
}

function changeBackground(condition){
    const body = document.querySelector("body");
    let back = "";
    if (condition === "partly-cloudy-day") {
        back = "https://i.ibb.co/qNv7NxZ/pc.webp";
    } else if (condition === "partly-cloudy-night") {
        back = "https://i.ibb.co/RDfPqXz/pcn.jpg";
    } else if (condition === "rain") {
        back = "https://i.ibb.co/h2p6Yhd/rain.webp";
    } else if (condition === "clear-day") {
        back = "https://i.ibb.co/WGry01m/cd.jpg";
    } else {
        back = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),  rgba(0,0,0,0.5)), url(${back})`
}
fahrenheitBtn.addEventListener("click", () => {
    changeUnit("F");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("C");
});
function changeUnit(unit){
    if(currentUnit != unit){
        currentUnit = unit;
        {
            tempUnit.forEach((ele) => {
                ele.innerText = `°${unit.toUpperCase()}`;
            });
            if(unit === "C"){
                celciusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            }else{
                celciusBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }
            getWeatherData(currentCity, currentUnit, hourlyOrWeek);
        }
    }
    
}

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});

function changeTimeSpan(unit){
    if(hourlyOrWeek != unit){
        hourlyOrWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        }else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    }
}

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let location = search.value;
    if(location !== ""){
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    }
});

cities = [
    "Banglore",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Chennai"
];

var currentFocus;

search.addEventListener("input",function(e){
    removeSuggeestions();
    var a,
    b,
    i,
    val = this.value;

    if( !val ){
        return false;
    }
    currentFocus = -1;

    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    this.parentNode.appendChild(a);

    for ( i = 0; i < cities.length; i++ ) {
 
        if(cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("li");

            b.innerHTML = "<strong>" + cities[i].substr(0,val.length) + "</strong>";

            b.innerHTML += cities[i].substr(val.length);

            b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

            b.addEventListener("click", function (e) {
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggeestions();
            });

            a.appendChild(b);
        }
    }
});

function removeSuggeestions(){
    var x = document.getElementById("suggestions");

    if(x) x.parentNode.removeChild(x);
}

search.addEventListener("keydown", function(e){
    var x = document.getElementById("suggestions");

    if(x) x = x.getElementsByTagName("li");

    if(e.keyCode == 40){

        currentFocus++;
        addActive(x);
    } else if(e.keyCode == 38){
        currentFocus--;
        addActive(x);
    }
    if(e.keyCode == 13){

        e.preventDefault();
        if(currentFocus > -1){

            if(x) x[currentFocus].click();
        }
    }
});

function addActive(x){
    if(!x) return false;
    removeActive(x);ff
    if(currentFocus >= x.length) currentFocus = 0;

    if(currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("active");
}

function removeActive(x){
    for( var i=  0; i < x.length; i++){
        x[i].classList.remove("active");
    } 
}

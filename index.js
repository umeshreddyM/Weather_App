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
    visibility = document.getElementById("visibilty"),
    humidityStatus = document.getElementById("humidity-status"),
    airQuality = document.getElementById("air-quality"),
    airQualityStatus = document.getElementById("air-quality-status"),
    visibilityStatus = document.getElementById("visibility-status")


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
    hour = hour %12;
    if (hour< 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;

}
date.innerText = getDateTime();

setInterval(()=> {
    date.innerText = getDateTime();
},1000);

function getPublicIp(){
    fetch("https://geolocation-db.com/json/" ,{
        method: "GET",
    })
    .then((response)=> {
        return response.json();

    }).then((data)=> {
        // console.log(data);
        currentCity = data.currentCity;
        getWeatherData(data.city, currentUnit, hourlyOrWeek)
    });
}

getPublicIp();

function getWeatherData(city, unit, hourlyOrWeek){
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json
`,{
    method: "GET",
}).then((response)=> response.json())
.then((data)=>{
    let today = data.currentConditions;
    if(unit === "C"){
        temp.innerText = today.temp;
    } else{
        temp.innerText = celciusToFahrenheit(today.temp)
    }
    currentLocation.innerText = data.resolvedAddress;
    condition.innerText = today.conditions;
    rain.innerText = "perc -" + today.precip + "%";
    uvIndex.innerText =  today.uvindex;
    windSpeed.innerText = today.windspeed;
    humidity.innerText = today.humidity + "%";
    visibility.innerText = today.visibility;
    airQuality.innerText = today.winddir;
    sunRise.innerText = today.sunrise;
    sunSet.innerText =  today.sunset;
    measureUvIndex(today.uvindex);
    updateHumidityStatus(today.humidity);
    updateVisibilityStatus(today.visibility);
    updateAirQualityStatus(today.winddir);

});
}

function celciusToFahrenheit(temp){
    return ((temp*9)/5 + 32).toFixed(1);
}
function measureUvIndex(uvindex){
    if(uvindex <= 2){
        uvText.innerText = "Low"
    } else  if(uvindex <= 5){
        uvText.innerText = "Moderate"
    }
    else  if(uvindex <= 7){
        uvText.innerText = "HIgh"
    }
    else  if(uvindex <= 10){
        uvText.innerText = "Very High"
    }
    else{
        uvText.innerText = "Extreme"
    }
}


let arrr = []
let Pro = fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/banglore?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json")
Pro.then((response)=>{
    return response.json()
}).then((data)=>{
    // console.log(data);
    arrr = data;
    console.log(arrr);
    
    data.forEach((user) => {
        const name =`<li>${user.datetime}</li>`
        document.querySelector("ul").insertAdjacentHTML("beforeend",name)
    });
    
}).catch((err)=>{
    console.log(err);
    
})
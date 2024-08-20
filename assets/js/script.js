
const apiKey = '8d62c587b938fad1b353bc31e41cfbba';
const city = 'Tamil Nadu';


const weatherElement = document.getElementById('weather');
const navDiv = document.querySelector('.divCarousel');
const iframe = document.querySelector('.iframe');
const tonight = document.querySelector('.tonight');
var latitude  = 78.9629,longitude = 20.5937;

async function weathercheck(data){
    if(document.querySelector('#inputPassword2')){
        var city2 = document.querySelector('#inputPassword2').value;
    }
    if(!city2){
        city2 = city;
    }
    if(document.querySelector('#inputPassword2')){
        document.querySelector('#inputPassword2').value = '';
    }
    if(data){
        city2 = data;
    }
    var responseAPi = await apimethod(city2);
    if(!responseAPi.main){
        $('.alertNote').show(200);
        setTimeout(()=>{
            $('.alertNote').hide(200);
        },2000)
        return 0;
    }
     const temperature = (responseAPi.main.temp - 273.15).toFixed(2); 
     const description = responseAPi.weather[0].description;
     latitude = responseAPi.coord.lat
     longitude = responseAPi.coord.lon
     if(temperature < 9){
        var path = 'assets/image/icons/temperature.png';
    }else if(temperature <= 17){
        var path = 'assets/image/icons/storm.png';
    }else if(temperature <= 24){
        var path = 'assets/image/icons/cloudy.png';
    }else if(temperature <= 29){
        var path = 'assets/image/icons/suncloudy.png';
    }else {
        var path = 'assets/image/icons/weather-app.png';
    }
     const weatherInfo = `
        <div class="d-flex spaceArround align-items-center">
            <div>
                <img class="card-img-head" src="${path}" alt="Card image cap"> &nbsp;&nbsp;&nbsp;
            </div>
            <div>
                <h3 class="col-white">${responseAPi.name}</h3>
                <p class="col-white">Temperature: ${temperature}°C</p>
                <p class="col-white">Condition: ${description}</p>
            </div>
         </div>
        <div class="d-flex col-white spaceArround">
            <div>
                <h6>Humanity</h6>
                <p>${responseAPi.main.humidity}</p>
           </div>
            <div>
                <h6>Lattitude</h6>
                <p>${(latitude).toFixed(3)}</p>
           </div>
            <div>
                <h6>longitude</h6>
                <p>${(longitude).toFixed(3)}</p>
           </div>
        </div>
     `;
     if(temperature < 9){
         document.querySelector('.openWeather').style.background = "url('./assets/image/thunder.jpg')"
     }else if(temperature < 17){
        document.querySelector('.openWeather').style.background = "url('./assets/image/cloud-mood.jpg')"
    }else if(temperature < 24){
        document.querySelector('.openWeather').style.background = "url('./assets/image/clouds.jpg')"
    }else{
         document.querySelector('.openWeather').style.background = "url('./assets/image/sunny.jpg')"
    }
    var dateTime = new Date();
    var ISTTime = new Date(dateTime.getTime() + 1000);
    var options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    var formatter = new Intl.DateTimeFormat('en-IN', options);
    var formattedIST = formatter.format(ISTTime);
    
    tonight.innerHTML = `<div>
                            <h5>Current Weather</h5>
                             <p>${formattedIST.split('at')[1]}</p>
                        </div>
                        <div class="d-flex spaceArround">
                            <div>
                                <img class="card-img" src="${path}" alt="Card image cap"> &nbsp;&nbsp;&nbsp;
                            </div>
                            <div>
                                <h3 class="col-white">${responseAPi.name}</h3>
                                <p class="col-white">${temperature}°C</p>
                            </div>
                        </div>
                        `
     weatherElement.innerHTML = weatherInfo;
     await fetchWeather(city2);
     iframe.innerHTML = `<iframe width="100%" height="400" src="https://embed.windy.com/embed2.html?lat=${latitude}&lon=${longitude}&detailLat=${latitude}&detailLon=${longitude}&width=650&height=450&zoom=10&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1" frameborder="0"></iframe>`
     if(!data){
         await loopingCity();
     }
}


var apimethod = (city2)=>{
    return data = new Promise((resolveInner) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city2}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            resolveInner(data);
            // return data;
        })  .catch(error => {
            document.getElementsByClassName('alertNote')[0].classList.remove('d-none');
            setTimeout(()=>{
                document.getElementsByClassName('alertNote')[0].classList.add('d-none');
            },2000)
            resolveInner(error);
            console.error('Error fetching weather data:', error);
        });
    });
} 

const array = [];

async function loopingCity(){
    var cityAllData = ['Delhi','Mumbai','Kerala', 'Andhra Pradesh','Maharastra','Himachal pradesh','Tamil Nadu', 'Ooty','Kodaikanal'];
    var loadData = '';
    for(i=0; i < cityAllData.length; i++){
        var data = await apimethod(cityAllData[i]);
        array.push(data);
        var temperature = (data.main.temp - 273.15).toFixed(2); 
        var description = data.weather[0].description;
        if(temperature < 9){
            var path = 'assets/image/icons/temperature.png';
        }else if(temperature <= 17){
            var path = 'assets/image/icons/storm.png';
        }else if(temperature <= 24){
            var path = 'assets/image/icons/cloudy.png';
        }else if(temperature <= 29){
            var path = 'assets/image/icons/suncloudy.png';
        }else {
            var path = 'assets/image/icons/weather-app.png';
        }
        var weatherInfo = `
            <div class="item active">
                <div class="col-xs-12 col-sm-6 col-md-3 navDiv d-flex align-content-center">
                    <h6 class="col-white">${data.name}</h6> &nbsp;&nbsp;&nbsp;
                    <img class="card-img2" src="${path}" alt="Card image cap"> &nbsp;&nbsp;&nbsp;
                    <p class="col-white">${temperature}°C</p>
                </div>  
            </div>
        `;
        loadData += weatherInfo
        navDiv.innerHTML = loadData;
        if(i == cityAllData.length-1){
            await eventCall() 
        }
    }
}

async function fetchWeather(city2) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city2}&appid=${apiKey}`);
    const data = await response.json();
    var weatherData = '';
    const cardsValue = document.getElementsByClassName('cardsValue');
    cardsValue[0].innerHTML = '';
    data.list.forEach((datas)=>{
        const temperature = (datas.main.temp - 273.15).toFixed(2); 
        const description = datas.weather[0].description;
        const ISTOffset =  1000;
        const dateTimeString = datas.dt_txt;
        debugger;
        const isoDateTimeString = dateTimeString.replace(' ', 'T');
        const dateTime = new Date(isoDateTimeString);
        const ISTTime = new Date(dateTime.getTime() + ISTOffset);
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
            const formatter = new Intl.DateTimeFormat('en-IN', options);
            const formattedIST = formatter.format(ISTTime);
            const ISTHours = ISTTime.getUTCHours();
            var date = new Date;
            var day = ISTTime.getDay();  
            var dayNames = ["Sun", "Mon", "Tue","Wed", "Thur", "Fri" , "Sat"];   
        if(ISTTime.getDate() >= date.getDate() && ISTTime.getHours() >= date.getHours()){
            if(temperature < 9){
                var path = 'assets/image/icons/temperature.png';
            }else if(temperature <= 17){
                var path = 'assets/image/icons/storm.png';
            }else if(temperature <= 24){
                var path = 'assets/image/icons/cloudy.png';
            }else if(temperature <= 29){
                var path = 'assets/image/icons/suncloudy.png';
            }else {
                var path = 'assets/image/icons/weather-app.png';
            }
            var weatherInfo = `
                <div class="item active">
                    <div class="col-xs-12 col-sm-6 col-md-3 downDiv d-block align-content-center">
                        <h6 class="col-white text-center">${dayNames[day] + ' ' + ISTTime.getDate() + '      ' + formattedIST.split('at')[1]}</h6>
                        <div class="d-flex spaceArround">
                            <img class="card-img" src="${path}" alt="Card image cap">
                            <div>
                                <p class="col-white">${temperature}°C</p>
                            
                            </div>

                        </div>
                    </div>  
                </div>
            `;
            weatherData += weatherInfo
        }else if((ISTTime.getDate() >= (date.getDate()+1))){
            if(temperature < 9){
                var path = 'assets/image/icons/temperature.png';
            }else if(temperature <= 17){
                var path = 'assets/image/icons/storm.png';
            }else if(temperature <= 24){
                var path = 'assets/image/icons/cloudy.png';
            }else if(temperature <= 29){
                var path = 'assets/image/icons/suncloudy.png';
            }else {
                var path = 'assets/image/icons/weather-app.png';
            }
            var weatherInfo = `
                <div class="item active">
                    <div class="col-xs-12 col-sm-6 col-md-3 downDiv d-block align-content-center">
                        <h6 class="col-white text-center">${dayNames[day] + ' ' + ISTTime.getDate() + '      ' + formattedIST.split('at')[1]}</h6>
                        <div class="d-flex spaceArround">
                            <img class="card-img" src="${path}" alt="Card image cap">
                              <div>
                                <p class="col-white">${temperature}°C</p>
                            </div>
                        </div>
                    </div>  
                </div>
            `;
            weatherData += weatherInfo
        }

            cardsValue[0].innerHTML = weatherData;

    })
}

var input = document.getElementById("inputPassword2");


input.addEventListener("keypress", async function(event) {

  if (event.key === "Enter") {
    event.preventDefault();
    await weathercheck();
  }
});

$('.leftArrow').on('click',function(){
    $('.divCarousel')[0].scrollLeft -= 50
})

$('.rightArrow').on('click',function(){
    $('.divCarousel')[0].scrollLeft += 50
})

$('.downLeftArrow').on('click',function(){
    $('.cardsValue')[0].scrollLeft -= 50
})

$('.downRightArrow').on('click',function(){
    $('.cardsValue')[0].scrollLeft += 50
})

document.querySelector('.cardsValue').addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
        if(delta == -1){
            $('.cardsValue')[0].scrollLeft += 50
        }else if(delta == 1){
            $('.cardsValue')[0].scrollLeft -= 50
        }
        event.stopPropagation();
});

document.querySelector('.divCarousel').addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
        if(delta == -1){
            $('.divCarousel')[0].scrollLeft += 50
        }else if(delta == 1){
            $('.divCarousel')[0].scrollLeft -= 50
        }
        event.stopPropagation();
});

function eventCall(){
    $(document).ready(()=>{
        $('.item').on('click',async (e)=>{
            await weathercheck($(e.currentTarget).find('h6').text());
        })
    })
}

$(window).on('load',function(){
    setTimeout(function(){
        $('.page-loader').fadeOut('slow');
    },2000);
});

weathercheck();
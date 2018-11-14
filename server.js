let express = require('express');
let app = express();
let request = require('request-promise');
let mongoose = require('mongoose');
let weather;

app.set('view engine', 'ejs');

mongoose.connect('mongodb://admin:admin1@ds163103.mlab.com:63103/weatherapp');

let citySchema = new mongoose.Schema({
   name: String
});

let cityModel = mongoose.model('City', citySchema);

// let lasvegas = new cityModel({name: 'Las Vegas'});
// let toronto = new cityModel({name: 'Toronto'});
// let newyork = new cityModel({name: 'New York'});
// lasvegas.save();
// toronto.save()
// newyork.save()


async function getWeather(cities) {
    let weather_data = [];
    for (let city_obj of cities) {
        let city = city_obj.name;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=271d1234d3f497eed5b1d80a07b3fcd1`;
        let res_body = await request(url);
        let weather_json = JSON.parse(res_body);
        let weather = {
            city: weather_json.name,
            temperature: Math.round(weather_json.main.temp),
            description: weather_json.weather[0].description,
            icon: weather_json.weather[0].icon
        }
        weather_data.push(weather);
    }

    return weather_data;
}

app.get('/', function (req,res) {

    cityModel.find({}, function (err,cities) {
        // console.log(cities);
        getWeather(cities).then(function(results) {
           // console.log(results);

           let weather_data = {weather_data: results};
           res.render('weather', weather_data);
        });
    });
});

app.listen(3000);
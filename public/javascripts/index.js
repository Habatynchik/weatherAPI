$(document).ready(function () {
    function getBackground(condition) {
        const text = condition.toLowerCase();
        console.log(text);
        if (text.includes("clear sky")) {
            return "url('https://i.gifer.com/Lx0q.gif')";
        }
        if (text.includes("few clouds")) {
            return "url('https://media4.giphy.com/media/h2U7mw5FtSqDenaGwJ/giphy.gif?cid=6c09b952f95l16ur1px0fz6e6ua2g2syjq7k8vj5rbf0d1xp&ep=v1_gifs_search&rid=giphy.gif&ct=g')";
        }
        if (text.includes("broken clouds")) {
            return "url('https://25.media.tumblr.com/441d6e39380801251a82374476b2769b/tumblr_mmdzgnSgC21r1l1jwo1_500.gif')";
        }
        if (text.includes("scattered clouds")) {
            return "url('https://i.pinimg.com/originals/c8/ba/30/c8ba30ee61944cc26dbde4022a0a4b72.gif')";
        }
        if (text.includes("overcast clouds")) {
            return "url('https://i.pinimg.com/originals/b6/7f/61/b67f61a1364ea22a050d701c7bf7858f.gif')";
        }
        if (text.includes("rain")) {
            return "url('https://forums.synfig.org/uploads/default/original/2X/3/31838d4b71b86e1cf16718fa28568840fd859955.gif')";
        }
        return "url('https://mir-s3-cdn-cf.behance.net/project_modules/source/d241d716071075.562a50091d914.gif')";
    }

    function renderForecast(data) {
        console.log(data);

        if ( !data.weather) {
            $("#forecastContainer").html("");
            return;
        }
        const list = data.weather.list;
        const dailyData = {};

        list.forEach((entry) => {
            const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
            if (!dailyData[date]) {
                dailyData[date] = {
                    temps: [],
                    icon: entry.weather[0].icon,
                    description: entry.weather[0].description,
                };
            }
            dailyData[date].temps.push(entry.main.temp);
        });

        const forecastHTML = Object.entries(dailyData)
            .slice(0, 5)
            .map(([dateStr, info]) => {
                const date = new Date(dateStr).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                });

                const minTemp = Math.min(...info.temps);
                const maxTemp = Math.max(...info.temps);

                return `
                <div class="forecast-item">
                    <strong>${date}</strong><br/>
                    <img src="http://openweathermap.org/img/wn/${info.icon}.png" alt="${info.description}" />
                    <div>${Math.round(minTemp)}° / ${Math.round(maxTemp)}°C</div>
                    <div style="font-size: 0.8em;">${info.description}</div>
                </div>
            `;
            })
            .join("");

        $("#forecastContainer").html(forecastHTML);
    }

    function renderWeather(data) {
        if (data.error) {
            $("#weatherContainer").html("");
            $("#errorMessage").html(data.error);
            $("body").css("background-image", "none");
            return;
        }

        $("#errorMessage").text("");
        const weather = data.weather;
        const condition = weather.weather[0].main;
        const description = weather.weather[0].description;
        const icon = weather.weather[0].icon;
        const city = weather.name;
        const temp = weather.main.temp.toFixed(1);
        const feels = (weather.main.feels_like).toFixed(1);
        const wind = weather.wind.speed;
        const clouds = weather.clouds.all;

        $("body").css("background-image", getBackground(description));

        const html = `
          <h2>${city}</h2>
          <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
          <p>${description}</p>
          <p>🌡 Temperature: ${temp}°C (Feels like ${feels}°C)</p>
          <p>☁ Clouds: ${clouds}%</p>
          <p>💨 Winds: ${wind} м/s</p>
        `;

        $("#weatherContainer").html(html);
    }

    function fetchWeather(city) {
        if (!city) return;

        $.get(`/weather/${city}`).done(renderWeather).fail();
    }

    function fetchForecast(city) {
        if (!city) return;

        $.get(`/weather/forecast/${city}`).done(renderForecast).fail();
    }

    $("#searchBtn").on("click", function () {
        const city = $("#cityInput").val().trim() || $("#citySelect").val();
        fetchWeather(city);
        fetchForecast(city);
    });

    $("#citySelect").on("change", function () {
        const city = $(this).val();
        if (city) {
            fetchWeather(city);
            fetchForecast(city);
        }
    });
});

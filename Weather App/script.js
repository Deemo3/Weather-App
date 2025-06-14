document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".search-box input");
  const searchBtn = document.querySelector(".search-box button");
  const weatherIcon = document.getElementById("weather-icon");
  const weatherBox = document.querySelectorAll(".weather-box")[1];
  const notFound = document.querySelector(".not-found");
  const forecastBox = document.querySelector(".hourly-forecast");
  const temp = document.querySelectorAll(".temperature")[1];
  const desc = document.querySelectorAll(".description")[1];
  const city = document.querySelector(".city");
  const weatherDetails = document.querySelector(".weather-details");
  const defaultMessage = document.querySelector(".weather-box.default");

  const apiKey = "cf2042167d5d359c90018a3a67737d5d";

  async function getWeather(cityName) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl),
      ]);

      if (!weatherRes.ok || !forecastRes.ok) throw new Error("Not found");

      const data = await weatherRes.json();
      const forecastData = await forecastRes.json();

      notFound.style.display = "none";
      weatherBox.style.display = "block";
      weatherDetails.style.display = "block";
      forecastBox.style.display = "flex";
      defaultMessage.style.display = "none";

      const iconCode = data.weather[0].icon;
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      temp.textContent = `${Math.round(data.main.temp)}°C`;
      desc.textContent = data.weather[0].description;
      city.textContent = `${data.name}, ${data.sys.country}`;

      forecastBox.innerHTML = "";
      const next24Hours = forecastData.list.slice(0, 8);
      next24Hours.forEach((item) => {
        const hour = new Date(item.dt_txt).getHours();
        const icon = item.weather[0].icon;
        const temp = Math.round(item.main.temp);

        const div = document.createElement("div");
        div.classList.add("hour");
        div.innerHTML = `
          <p>${hour}:00</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" />
          <p>${temp}°</p>
        `;
        forecastBox.appendChild(div);
      });

    } catch (error) {
      weatherBox.style.display = "none";
      weatherDetails.style.display = "none";
      forecastBox.style.display = "none";
      notFound.style.display = "block";
      defaultMessage.style.display = "none";
    }
  }

  searchBtn.addEventListener("click", () => {
    const cityName = searchBox.value.trim();
    if (cityName) {
      getWeather(cityName);
    }
  });

  searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cityName = searchBox.value.trim();
      if (cityName) {
        getWeather(cityName);
      }
    }
  });
});

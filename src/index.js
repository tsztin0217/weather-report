const state = {
  temperatureFahrenheit: 60,
  defaultCityName: 'Seattle',
};

// ---------- API helpers ----------

const findLatitudeAndLongitude = async (query) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/location', {
      params: {
        q: query,
      }
    });
    return { latitude: response.data[0].lat, longitude: response.data[0].lon };
  } catch (error) {
    console.log(`Error searching ${query}:`, error.message);
    return null;
  }
};

const findTemFromCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/weather', {
      params: {
        lat: lat,
        lon: lon,
      }}
    );
    return response.data.main.temp;

  } catch (error) {
    console.log(`Error getting temperature at (${lat}, ${lon}):`, error.message);
    return null;
  }
};

// ---------- Pure helpers ----------

const convertKelvinToFahrenheit = (kelvinTemp) => {
  return Math.round((kelvinTemp - 273.15) * 9/5 + 32);
};

const getTempColor = (temp) => {
  if (temp >= 80) return '#a83232';
  if (temp >= 70) return '#a8783b';
  if (temp >= 60) return '#7c7f3a';
  if (temp >= 50) return '#3e6b56';
  return '#3d5a80';
};

const getLandscapeForTemp = (temp) => {
  if (temp >= 70) return '🌸🌿🌼__🌷🌻🌿_☘️';
  if (temp >= 60) return '🌾🌾_🍃_🪨_🍃🌾🌾';
  if (temp >= 50) return '🍂🍁_🍃_🪨_🍃🍂🍁';
};

const getSkyForWeather = (weather) => {
  switch (weather) {
    case 'Sunny':
      return '☁️ ☁️ ☁️ ☁️ ☀️ ☁️ ☁️ ☁️ ☁️';
    case 'Cloudy':
      return '☁️☁️ ☁️ ☁️☁️ 🌤 ☁️☁️ ☁️ ☁️☁️';
    case 'Rainy':
      return '🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧';
    case 'Snowy':
      return '🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨';
    default:
      return '';
  }
};

const getBackgroundForTemperature = (temp) => {
  if (temp >= 80) return 'linear-gradient(#5a1d1d, #a83232)';
  if (temp >= 70) return 'linear-gradient(#4b2e0f, #a8783b)';
  if (temp >= 60) return 'linear-gradient(#2d331a, #7c7f3a)';
  if (temp >= 50) return 'linear-gradient(#1b2e24, #3e6b56)';
  return 'linear-gradient(#1a2238, #3d5a80)';
};

const createImage = (imgFileName) => {
  const image = document.createElement('img');
  image.src = `./imgs/${imgFileName}`;
  return image;
};

// ---------- Business logic ----------

const changeTemperatureBy = (delta) => {
  state.temperatureFahrenheit += delta;
  render();
};

const getRealTimeTemperature = async (cityName) => {
  const coordinates = await findLatitudeAndLongitude(cityName);
  if (!coordinates) return;

  const kelvinTemp = await findTemFromCoordinates(coordinates.latitude, coordinates.longitude);
  if (kelvinTemp == null) return;

  state.temperatureFahrenheit = convertKelvinToFahrenheit(kelvinTemp);
  render();
};

const resetCityName = (defaultCityName) => {
  state.cityNameInput.value = defaultCityName;
  renderCityName(defaultCityName);
}

// ---------- Rendering ----------

const renderTemp = () => {
  state.tempValue.textContent = state.temperatureFahrenheit;
  state.tempValue.style.color = getTempColor(state.temperatureFahrenheit);
};

const renderBackground = () => {
  document.body.style.background = getBackgroundForTemperature(state.temperatureFahrenheit);
};

const renderLandscape = () => {
  // Extremely hot: show "this is fine" gif instead of emojis
  if (state.temperatureFahrenheit >= 80) {
    state.landscape.textContent = '';
    state.landscape.appendChild(createImage('this-is-fine.gif'));
    return;
  }

  state.landscape.textContent = getLandscapeForTemp(state.temperatureFahrenheit);

  // Extremely cold: add a blue border
  if (state.temperatureFahrenheit < 50) {
    state.landscape.textContent = '';
    state.landscape.appendChild(createImage('freezing-cold.jpg'));
    return;
  }
};

const renderSky = (skyCondition) => {
  state.sky.textContent = getSkyForWeather(skyCondition);
};

const renderCityName = (cityName) => {
  state.cityNameDisplay.textContent = cityName;
};

const render = () => {
  renderTemp();
  renderLandscape();
  renderSky(state.skySelect.value);
  renderCityName(state.cityNameInput.value);
  renderBackground();
};

// ---------- Events & initialization ----------

const registerEvents = () => {
  state.increaseTempControl.addEventListener('click', () => changeTemperatureBy(1));
  state.decreaseTempControl.addEventListener('click', () => changeTemperatureBy(-1));
  state.cityNameInput.addEventListener('input', (event) => renderCityName(event.target.value));
  state.currentTempButton.addEventListener('click', async () => getRealTimeTemperature(state.cityNameInput.value));
  state.skySelect.addEventListener('change', (event) => renderSky(event.target.value));
  state.cityNameReset.addEventListener('click', () => resetCityName(state.defaultCityName));
};

const loadControls = () => {
  state.increaseTempControl = document.getElementById('increaseTempControl');
  state.decreaseTempControl = document.getElementById('decreaseTempControl');
  state.tempValue = document.getElementById('tempValue');
  state.sky = document.getElementById('sky');
  state.landscape = document.getElementById('landscape');
  state.cityNameInput = document.getElementById('cityNameInput');
  state.cityNameDisplay = document.getElementById('headerCityName');
  state.currentTempButton = document.getElementById('currentTempButton');
  state.skySelect = document.getElementById('skySelect');
  state.cityNameReset = document.getElementById('cityNameReset');
};

loadControls();
registerEvents();
render();
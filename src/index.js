const state = {
  temp: 60
};



// ---------- Pure helpers ----------

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

const convertKelvinToFahrenheit = (kelvinTemp) => {
  return Math.round((kelvinTemp - 273.15) * 9/5 + 32);
};

const getTempColor = (temp) => {
  if (temp >= 80) return '#ff3333ff';
  if (temp >= 70) return '#ff8d1a';
  if (temp >= 60) return '#ffff00';
  if (temp >= 50) return '#12e02eff';
  return '#2651ffff';
};

const getLandscapeForTemp = (temp) => {
  if (temp >= 70) return '🌸🌿🌼__🌷🌻🌿_☘️';
  if (temp >= 60) return '🌾🌾_🍃_🪨_🍃🌾🌾';
  if (temp >= 50) return '🍂🍁_🍃_🪨_🍃🍂🍁';
  return '🌲🌲⛄️🌲⛄️🌲🌲';
};

const createImage = (imgFileName) => {
  const image = document.createElement('img');
  image.src = `./imgs/${imgFileName}`;
  return image;
};


const getRealTimeTemperature = async (cityName) => {
  const coords = await findLatitudeAndLongitude(cityName);
  const kelvinTemp = await findTemFromCoordinates(coords.latitude, coords.longitude);

  state.temp = convertKelvinToFahrenheit(kelvinTemp);
  render();

};

// ---------- State + rendering ----------

const changeTemperatureBy = (delta) => {
  state.temp += delta;
  render();
};

const renderTemp = () => {
  state.tempValue.textContent = state.temp;
  state.tempValue.style.color = getTempColor(state.temp);
};

const renderLandscape = () => {
  // Extremely hot: show "this is fine" gif instead of emojis
  if (state.temp >= 80) {
    state.landscape.textContent = '';
    state.landscape.appendChild(createImage('this-is-fine.gif'));
    return;
  }

  state.landscape.textContent = getLandscapeForTemp(state.temp);

  // Extremely cold: add a blue border
  if (state.temp < 50) {
    state.landscape.textContent = '';
    state.landscape.appendChild(createImage('freezing-cold.jpg'));
    return;
  }
};

const renderCityName = (cityName) => {
  state.cityNameDisplay.textContent = cityName;
};

const render = () => {
  renderTemp();
  renderLandscape();
  renderCityName(state.cityNameInput.value);
};

// ---------- Events & initialization ----------

const registerEvents = () => {
  state.increaseTempControl.addEventListener('click', () => changeTemperatureBy(1));
  state.decreaseTempControl.addEventListener('click', () => changeTemperatureBy(-1));
  state.cityNameInput.addEventListener('input', (event) => renderCityName(event.target.value));
  state.currentTempButton.addEventListener('click', async () => getRealTimeTemperature(state.cityNameInput.value));
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
};

loadControls();
registerEvents();
render();
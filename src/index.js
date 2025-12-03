// const axios = require('axios');
// const dotEnv = require('dotenv');
// dotEnv.config();

const state = {
  temp: 60,
};

// ---------- Pure helpers ----------

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

const render = () => {
  renderTemp();
  renderLandscape();
};

// ---------- Events & initialization ----------

const registerEvents = () => {
  state.increaseTempControl.addEventListener('click', () => changeTemperatureBy(1));
  state.decreaseTempControl.addEventListener('click', () => changeTemperatureBy(-1));
};

const loadControls = () => {
  state.increaseTempControl = document.getElementById('increaseTempControl');
  state.decreaseTempControl = document.getElementById('decreaseTempControl');
  state.tempValue = document.getElementById('tempValue');
  state.sky = document.getElementById('sky');
  state.landscape = document.getElementById('landscape');
};

loadControls();
registerEvents();
render();
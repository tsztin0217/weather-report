// const axios = require('axios');
// const dotEnv = require('dotenv');
// dotEnv.config();

const state = {
  temp: 60,
};

const handleDecreaseTemp = () => {
  state.temp -= 1;
  refreshUI();
}

const handleIncreaseTemp = () => {
  state.temp += 1;
  refreshUI();
}

const handleTempColor = (temp) => {
  if (temp >= 80) {
    return '#ff3333ff';
  }
  if (temp >= 70) {
    return '#ff8d1a';
  }
  if (temp >= 60) {
    return '#ffff00';
  }
  if (temp >= 50) {
    return '#12e02eff';
  }
  return '#2651ffff';
}

const handleGardenContent = (temp) => {
  if (temp >= 70) {
    return '🌸🌿🌼__🌷🌻🌿_☘️';
  }
  if (temp >= 60) {
    return '🌾🌾_🍃_🪨_🍃🌾🌾';
  }
  if (temp >= 50) {
    return '🍂🍁_🍃_🪨_🍃🍂🍁';
  }
  return '🌲🌲⛄️🌲⛄️🌲🌲';
}

const addThisIsFineImageToLandscape = () => {
  const newImage = createNewThisIsFineImageElement();
  state.landscape.appendChild(newImage);
  refreshUI();
};

const createNewThisIsFineImageElement = () => {
  const newImgName = './imgs/this-is-fine.gif';
  const newImage = document.createElement('img');
  newImage.src = newImgName;
  newImage.alt = 'The dog in the burning house saying This is fine';
  return newImage;
};

const refreshUI = () => {
  state.tempValue.textContent = state.temp;
  state.tempValue.style.color = handleTempColor(state.temp);
  state.landscape.textContent = handleGardenContent(state.temp);

  if (state.temp >= 80) {
    state.landscape.textContent = '';
    const newImage = createNewThisIsFineImageElement();
    state.landscape.appendChild(newImage);
  }
}

const registerEvents = () => {
  state.increaseTempControl.addEventListener('click', handleIncreaseTemp);
  state.decreaseTempControl.addEventListener('click', handleDecreaseTemp);
};

const loadControls = () => {
  state.increaseTempControl = document.getElementById('increaseTempControl');
  state.tempValue = document.getElementById('tempValue');
  state.decreaseTempControl = document.getElementById('decreaseTempControl');
  state.sky = document.getElementById('sky');
  state.landscape = document.getElementById('landscape');
};

loadControls();
registerEvents();
refreshUI();
const ALERT_SHOW_TIME = 5000;

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateUniqueIds = (count, min, max) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInt(min, max));
  }
  return Array.from(ids);
};

export const isEscapeKey = (evt) => evt.key === 'Escape';

export const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export const throttle = (callback, delayBetweenFrames) => {
  let lastTime = 0;
  return (...rest) => {
    const now = new Date();
    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
};


export const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.classList.add('data-error');
  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

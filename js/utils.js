/**
 * Возвращает случайное целое число в заданном диапазоне
 * @param {number} min - минимальное значение (включительно)
 * @param {number} max - максимальное значение (включительно)
 * @returns {number} случайное число
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Генерирует массив уникальных идентификаторов
 * @param {number} count - количество идентификаторов
 * @param {number} min - минимальное значение ID
 * @param {number} max - максимальное значение ID
 * @returns {number[]} массив уникальных ID
 */
export function generateUniqueIds(count, min, max) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInt(min, max));
  }
  return Array.from(ids);
}

/**
 * Проверяет, является ли нажатая клавиша Escape
 * @param {KeyboardEvent} evt - объект события
 * @returns {boolean} true, если нажата клавиша Escape
 */
export function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

export function debounce(callback, timeoutDelay = 500) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

export function throttle(callback, delayBetweenFrames) {
  let lastTime = 0;
  return (...rest) => {
    const now = new Date();
    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
}

const ALERT_SHOW_TIME = 5000;

export const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.classList.add('data-error');

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

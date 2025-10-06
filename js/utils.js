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

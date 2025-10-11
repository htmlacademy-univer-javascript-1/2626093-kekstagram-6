import { getRandomInt } from './utils.js';
import { generateComments } from './comments.js';

// Объект для кэширования сгенерированных данных фотографий
let photoCache = null;

/**
 * Генерирует массив объектов с данными для фотографий
 * @param {number} count - количество фотографий
 * @returns {Array} массив объектов с данными фотографий
 */
export function generatePhotoData(count = 25) {
  // Используем кэш, если он есть
  if (photoCache) {
    return photoCache;
  }

  const photos = [];

  for (let i = 1; i <= count; i++) {
    const commentsCount = getRandomInt(0, 20);

    photos.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: `Фотография №${i}`,
      likes: getRandomInt(15, 200),
      comments: generateComments(commentsCount)
    });
  }

  // Сохраняем сгенерированные данные в кэш
  photoCache = photos;
  return photos;
}

// Генерируем и экспортируем данные для разработки
export const photoData = generatePhotoData();

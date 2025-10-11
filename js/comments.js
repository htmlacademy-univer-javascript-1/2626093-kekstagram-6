import { getRandomInt, generateUniqueIds } from './utils.js';
import { DESCRIPTIONS, NAMES } from './data.js';

/**
 * Генерирует массив комментариев
 * @param {number} count - количество комментариев для генерации
 * @returns {Array} массив объектов комментариев
 */
export function generateComments(count) {
  const comments = [];
  const commentIds = generateUniqueIds(count, 1, 1000);
  for (let i = 0; i < count; i++) {
    const messageCount = getRandomInt(1, 2);
    let message = '';
    for (let j = 0; j < messageCount; j++) {
      message += `${DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length - 1)]  } `;
    }
    comments.push({
      id: commentIds[i],
      avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
      message: message.trim(),
      name: NAMES[getRandomInt(0, NAMES.length - 1)]
    });
  }
  return comments;
}

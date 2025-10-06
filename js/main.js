const DESCRIPTIONS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артём',
  'Максим',
  'Иван',
  'Дмитрий',
  'Никита',
  'Михаил'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueIds(count, min, max) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInt(min, max));
  }
  return Array.from(ids);
}

function generateComments(count) {
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
      avatar: `img/avatar-${getRandomInt(1, 25)}.svg`,
      message: message.trim(),
      name: NAMES[getRandomInt(0, NAMES.length - 1)]
    });
  }
  return comments;
}

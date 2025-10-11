/**
 * Модуль для работы с полноразмерным режимом просмотра изображений
 */

import { isPhotoLiked, togglePhotoLike } from './liked-state.js';

const bigPictureElement = document.querySelector('.big-picture');
const bodyElement = document.querySelector('body');
const cancelButton = bigPictureElement.querySelector('.big-picture__cancel');
const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

/**
 * Создает DOM-элемент комментария
 * @param {Object} comment - объект с данными комментария
 * @returns {HTMLElement} - DOM-элемент комментария
 */
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(avatar);
  commentElement.appendChild(text);

  return commentElement;
}

/**
 * Отрисовывает комментарии к фотографии
 * @param {Array} comments - массив комментариев
 */
function renderComments(comments) {
  const commentsContainer = bigPictureElement.querySelector('.social__comments');
  commentsContainer.innerHTML = '';

  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  commentsContainer.appendChild(fragment);
}

/**
 * Обработчик клика по кнопке лайка
 * @param {Object} photo - объект с данными фотографии
 */
function onLikeClick(photo) {
  // Находим элементы, связанные с лайками
  const socialLikesElement = bigPictureElement.querySelector('.social__likes');
  const likesCountElement = bigPictureElement.querySelector('.likes-count');

  // Переключаем состояние лайка и сохраняем в хранилище
  const isLiked = togglePhotoLike(photo.id);

  // Обновляем отображение состояния лайка
  socialLikesElement.classList.toggle('social__likes--active', isLiked);

  // Увеличиваем или уменьшаем количество лайков в зависимости от состояния
  if (isLiked) {
    photo.likes += 1;
  } else {
    photo.likes -= 1;
  }

  // Обновляем отображение количества лайков
  likesCountElement.textContent = photo.likes;
}

/**
 * Показывает полноразмерное изображение
 * @param {Object} photo - объект с данными фотографии
 */
function showBigPicture(photo) {
  bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
  bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
  bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = photo.description;

  renderComments(photo.comments);

  // Скрываем блоки счётчика комментариев и загрузки новых комментариев
  commentCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');

  // Настройка функциональности лайков
  const likesContainer = bigPictureElement.querySelector('.social__likes');

  // Очищаем предыдущие обработчики через клонирование
  const newLikesContainer = likesContainer.cloneNode(true);
  likesContainer.parentNode.replaceChild(newLikesContainer, likesContainer);

  // Устанавливаем состояние лайка из хранилища
  const isLiked = isPhotoLiked(photo.id);
  newLikesContainer.classList.toggle('social__likes--active', isLiked);

  // Добавляем обработчик клика для лайка с предотвращением всплытия события
  newLikesContainer.addEventListener('click', (evt) => {
    evt.stopPropagation();
    onLikeClick(photo);
  });

  // Отображаем окно с полноразмерным изображением
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  // Добавляем обработчики событий
  document.addEventListener('keydown', onEscKeyDown);
  cancelButton.addEventListener('click', closeBigPicture);
}

/**
 * Закрывает полноразмерное изображение
 */
function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  // Удаляем обработчики событий
  document.removeEventListener('keydown', onEscKeyDown);
  cancelButton.removeEventListener('click', closeBigPicture);
}

/**
 * Обработчик нажатия клавиши Esc
 * @param {KeyboardEvent} evt - объект события
 */
function onEscKeyDown(evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
}

export { showBigPicture };

/**
 * Модуль для работы с полноразмерным режимом просмотра изображений
 */

import { isPhotoLiked, togglePhotoLike } from './liked-state.js';

const bigPictureElement = document.querySelector('.big-picture');
const bodyElement = document.querySelector('body');
const cancelButton = bigPictureElement.querySelector('.big-picture__cancel');
const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const commentsContainer = bigPictureElement.querySelector('.social__comments');

// Количество комментариев, отображаемых за один раз
const COMMENTS_PER_PORTION = 5;

// Храним текущие данные для работы с комментариями
let currentComments = [];
let displayedComments = 0;

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
 * Отрисовывает порцию комментариев к фотографии
 * @param {boolean} initial - флаг начальной загрузки (если true, контейнер очищается)
 */
function renderCommentsPortion(initial = false) {
  if (initial) {
    commentsContainer.innerHTML = '';
    displayedComments = 0;
  }

  const fragment = document.createDocumentFragment();
  const commentsToShow = Math.min(displayedComments + COMMENTS_PER_PORTION, currentComments.length);

  // Отображаем следующую порцию комментариев
  for (let i = displayedComments; i < commentsToShow; i++) {
    const commentElement = createCommentElement(currentComments[i]);
    fragment.appendChild(commentElement);
  }

  commentsContainer.appendChild(fragment);
  displayedComments = commentsToShow;

  // Обновляем счетчик комментариев
  commentCountElement.textContent = `${displayedComments} из ${currentComments.length} комментариев`;

  // Скрываем кнопку загрузки, если все комментарии загружены
  if (displayedComments >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
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
 * Обработчик клика по кнопке "Загрузить еще"
 */
function onCommentsLoaderClick() {
  renderCommentsPortion();
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

  // Сохраняем комментарии для пошаговой загрузки
  currentComments = photo.comments.slice();

  // Показываем первую порцию комментариев
  renderCommentsPortion(true);

  // Показываем блоки счётчика комментариев и загрузки новых комментариев
  commentCountElement.classList.remove('hidden');

  // Кнопка загрузки может быть скрыта, если комментариев меньше, чем COMMENTS_PER_PORTION
  // Это обрабатывается в renderCommentsPortion

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

  // Добавляем обработчик клика на кнопку "Загрузить еще"
  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);

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
  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);

  // Сбрасываем данные о комментариях
  currentComments = [];
  displayedComments = 0;
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

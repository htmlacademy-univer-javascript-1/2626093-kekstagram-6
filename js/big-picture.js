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
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCount = bigPictureElement.querySelector('.likes-count');
const socialCaption = bigPictureElement.querySelector('.social__caption');
const socialLikes = bigPictureElement.querySelector('.social__likes');

// Количество комментариев, отображаемых за один раз
const COMMENTS_PER_PORTION = 5;

// Храним текущие данные для работы с комментариями
let currentComments = [];
let displayedComments = 0;
let currentPhoto = null;

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
  commentCountElement.innerHTML = `<span class="social__comment-shown-count">${displayedComments}</span> из <span class="social__comment-total-count">${currentComments.length}</span> комментариев`;

  // Скрываем кнопку загрузки, если все комментарии загружены
  if (displayedComments >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
}

/**
 * Обработчик клика по кнопке лайка
 */
function onLikeClick() {
  if (!currentPhoto) {
    return;
  }

  // Переключаем состояние лайка и сохраняем в хранилище
  const isLiked = togglePhotoLike(currentPhoto.id);

  // Обновляем отображение состояния лайка
  socialLikes.classList.toggle('social__likes--active', isLiked);

  // Увеличиваем или уменьшаем количество лайков в зависимости от состояния
  if (isLiked) {
    currentPhoto.likes += 1;
  } else {
    currentPhoto.likes -= 1;
  }

  // Обновляем отображение количества лайков
  likesCount.textContent = currentPhoto.likes;
}

/**
 * Показывает полноразмерное изображение
 * @param {Object} photo - объект с данными фотографии
 */
function showBigPicture(photo) {
  currentPhoto = photo;

  // Заполняем данные фотографии
  bigPictureImg.src = photo.url;
  likesCount.textContent = photo.likes;
  socialCaption.textContent = photo.description;

  // Сохраняем комментарии для пошаговой загрузки
  currentComments = photo.comments.slice();

  // Показываем первую порцию комментариев
  renderCommentsPortion(true);

  // Показываем блоки счётчика комментариев
  commentCountElement.classList.remove('hidden');

  // Устанавливаем состояние лайка из хранилища
  const isLiked = isPhotoLiked(photo.id);
  socialLikes.classList.toggle('social__likes--active', isLiked);

  // Отображаем окно с полноразмерным изображением
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  // Добавляем обработчики событий
  document.addEventListener('keydown', onEscKeyDown);
}

/**
 * Закрывает полноразмерное изображение
 */
function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  // Удаляем обработчики событий
  document.removeEventListener('keydown', onEscKeyDown);

  // Сбрасываем данные
  currentPhoto = null;
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

// Инициализируем обработчики событий, которые не зависят от конкретной фотографии
cancelButton.addEventListener('click', closeBigPicture);
commentsLoaderElement.addEventListener('click', () => renderCommentsPortion());
socialLikes.addEventListener('click', onLikeClick);

export { showBigPicture };

import { showBigPicture } from './big-picture.js';

/**
 * Контейнер для отображения миниатюр
 * @type {HTMLElement}
 */
const picturesContainer = document.querySelector('.pictures');

/**
 * Шаблон миниатюры
 * @type {HTMLTemplateElement}
 */
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

/**
 * Создает DOM-элемент на основе объекта с данными фотографии
 * @param {Object} photo - объект с данными фотографии
 * @returns {HTMLElement} - DOM-элемент миниатюры
 */
function createThumbnail(photo) {
  const pictureElement = pictureTemplate.cloneNode(true);

  const img = pictureElement.querySelector('.picture__img');
  img.src = photo.url;
  img.alt = photo.description;

  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  // Добавляем обработчик клика для открытия полноразмерного изображения
  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    showBigPicture(photo);
  });

  return pictureElement;
}

/**
 * Отрисовывает миниатюры фотографий в контейнере
 * @param {Array} photos - массив с данными фотографий
 */
function renderThumbnails(photos) {
  const pictures = picturesContainer.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
}

export { renderThumbnails };

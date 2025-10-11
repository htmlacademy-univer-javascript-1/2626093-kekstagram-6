/**
 * Модуль для хранения состояния лайков фотографий
 */

// Ключ для хранения в localStorage
const LIKES_STORAGE_KEY = 'kekstagram-likes';

// Объект для хранения состояния лайков
let likedPhotos = {};

/**
 * Загружает состояние лайков из localStorage
 */
function loadLikedState() {
  try {
    const savedState = localStorage.getItem(LIKES_STORAGE_KEY);
    if (savedState) {
      likedPhotos = JSON.parse(savedState);
    }
  } catch (err) {
    // В случае ошибки используем пустой объект
    likedPhotos = {};
  }
}

/**
 * Сохраняет состояние лайков в localStorage
 */
function saveLikedState() {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedPhotos));
  } catch (err) {
    // Если возникла ошибка при сохранении - игнорируем
  }
}

/**
 * Проверяет, поставлен ли лайк для фотографии
 * @param {number} photoId - ID фотографии
 * @returns {boolean} - true, если лайк поставлен
 */
function isPhotoLiked(photoId) {
  return Boolean(likedPhotos[photoId]);
}

/**
 * Устанавливает состояние лайка для фотографии
 * @param {number} photoId - ID фотографии
 * @param {boolean} isLiked - состояние лайка
 */
function setPhotoLiked(photoId, isLiked) {
  if (isLiked) {
    likedPhotos[photoId] = true;
  } else {
    delete likedPhotos[photoId];
  }
  saveLikedState();
}

/**
 * Переключает состояние лайка для фотографии
 * @param {number} photoId - ID фотографии
 * @returns {boolean} - новое состояние лайка
 */
function togglePhotoLike(photoId) {
  const newState = !isPhotoLiked(photoId);
  setPhotoLiked(photoId, newState);
  return newState;
}

// Загружаем состояние лайков при инициализации
loadLikedState();

export { isPhotoLiked, togglePhotoLike };

import { initImageUploadForm } from './form.js';
import { renderThumbnails } from './gallery.js';
import { photoData } from './photo-data.js';

/**
 * Функция для проверки загрузки зависимостей и инициализации приложения
 */
function initializeApp() {
  // Проверяем, загрузились ли библиотеки
  if (!window.kekstagramApp || !window.kekstagramApp.librariesLoaded || typeof window.Pristine !== 'function') {
    // Если библиотеки не загружены, пробуем через 100мс
    setTimeout(initializeApp, 100);
    return;
  }

  // Библиотеки загружены, можно инициализировать приложение

  // Отображаем миниатюры фотографий пользователей (не зависит от Pristine)
  renderThumbnails(photoData);

  // Инициализируем форму загрузки изображения (зависит от Pristine)
  initImageUploadForm();
}

// Запускаем инициализацию приложения когда DOM будет загружен
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

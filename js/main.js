import { initImageUploadForm } from './form.js';
import { renderThumbnails } from './gallery.js';
import { getData } from './api.js';
import { showAlert } from './utils.js';

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

  // Загружаем данные с сервера
  getData(
    (photos) => {
      renderThumbnails(photos);
    },
    () => {
      showAlert('Не удалось загрузить данные. Попробуйте обновить страницу');
    }
  );

  // Инициализируем форму загрузки изображения (зависит от Pristine)
  initImageUploadForm();
}

// Запускаем инициализацию приложения когда DOM будет загружен
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

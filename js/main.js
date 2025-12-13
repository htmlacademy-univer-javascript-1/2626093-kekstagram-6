import { initImageUploadForm } from './form.js';
import { renderThumbnails } from './gallery.js';
import { getData } from './api.js';
import { showAlert } from './utils.js';
import { initFilters } from './filters.js';

/**
 * Функция для проверки загрузки зависимостей и инициализации приложения
 */
function initializeApp() {
  // Проверяем, загрузились ли библиотеки
  // Если Pristine загрузился, то считаем что все ок
  if (typeof window.Pristine !== 'function') {
    // Если библиотеки не загружены, пробуем через 100мс
    setTimeout(initializeApp, 100);
    return;
  }

  // Библиотеки загружены, можно инициализировать приложение

  // Загружаем данные с сервера
  getData(
    (photos) => {
      renderThumbnails(photos);
      initFilters(photos);
    },
    () => {
      showAlert('Не удалось загрузить данные. Попробуйте обновить страницу');
    }
  );

  // Инициализируем форму загрузки изображения (зависит от Pristine)
  initImageUploadForm();
}

// Запускаем инициализацию приложения
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 0);
  });
} else {
  setTimeout(initializeApp, 0);
}

import { initImageUploadForm } from './form.js';
import { renderThumbnails } from './gallery.js';
import { getData } from './api.js';
import { showAlert } from './utils.js';
import { initFilters } from './filters.js';

const initializeApp = () => {
  getData(
    (photos) => {
      renderThumbnails(photos);
      initFilters(photos);
    },
    () => {
      showAlert('Не удалось загрузить данные. Попробуйте обновить страницу');
    }
  );

  initImageUploadForm();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 0);
  });
} else {
  setTimeout(initializeApp, 0);
}

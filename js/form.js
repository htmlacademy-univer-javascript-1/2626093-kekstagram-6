import { isEscapeKey } from './utils.js';
import { resetScale, initScale } from './scale.js';
import { resetEffects, initEffects } from './effects.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

const MAX_HASHTAGS_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const VALID_HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const formElement = document.querySelector('.img-upload__form');
const imageUploadOverlay = document.querySelector('.img-upload__overlay');
const fileField = document.querySelector('#upload-file');
const cancelButton = document.querySelector('#upload-cancel');
const body = document.body;
const photoPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

let hashtagsField = null;
let commentField = null;
let submitButton = null;

let pristine = null;

function findFormElements() {
  if (!formElement) {
    return false;
  }

  hashtagsField = formElement.querySelector('.text__hashtags');
  commentField = formElement.querySelector('.text__description');
  submitButton = formElement.querySelector('.img-upload__submit');

  return hashtagsField && commentField && submitButton;
}

const validateHashtagsCount = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  return hashtags.length <= MAX_HASHTAGS_COUNT;
};

const validateHashtagsFormat = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  return !hashtags.some((hashtag) => !VALID_HASHTAG_REGEX.test(hashtag));
};

const validateNonEmptyHashtag = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  return !hashtags.some((hashtag) => hashtag === '#');
};

const validateHashtagsUnique = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/).filter((item) => item.length > 0);
  const uniqueHashtags = new Set(hashtags.map((hashtag) => hashtag.toLowerCase()));
  return uniqueHashtags.size === hashtags.length;
};

const validateComment = (value) => !value || value.length <= MAX_COMMENT_LENGTH;

const onFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const blockSubmitButton = () => {
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Публикую...';
  }
};

const unblockSubmitButton = () => {
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
  }
};

function closeImageUploadOverlay() {
  formElement.reset();
  if (pristine) {
    pristine.reset();
  }
  resetScale();
  resetEffects();
  imageUploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onFormEscKeydown);
  cancelButton.removeEventListener('click', closeImageUploadOverlay);
}

function onFormEscKeydown(evt) {
  if (document.activeElement === hashtagsField || document.activeElement === commentField) {
    return;
  }

  if (document.querySelector('.error')) {
    return;
  }

  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeImageUploadOverlay();
  }
}

function openImageUploadOverlay() {
  if (!imageUploadOverlay || !cancelButton) {
    return;
  }

  imageUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeydown);
  cancelButton.addEventListener('click', closeImageUploadOverlay);
}

const onFileFieldChange = () => {
  const file = fileField.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    photoPreview.src = URL.createObjectURL(file);
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${photoPreview.src})`;
    });
    openImageUploadOverlay();
  }
};

function initFormValidation() {
  if (!formElement || !hashtagsField || !commentField) {
    return;
  }

  if (typeof window.Pristine !== 'function') {
    return;
  }

  // Destroy existing pristine instance if any
  if (pristine) {
    pristine.destroy();
  }

  pristine = new window.Pristine(formElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  pristine.addValidator(
    hashtagsField,
    validateHashtagsCount,
    `Нельзя указать больше ${MAX_HASHTAGS_COUNT} хэш-тегов`
  );

  pristine.addValidator(
    hashtagsField,
    validateHashtagsFormat,
    'Хэш-тег должен начинаться с # и содержать только буквы и цифры (до 20 символов)'
  );

  pristine.addValidator(
    hashtagsField,
    validateHashtagsUnique,
    'Хэш-теги не должны повторяться'
  );

  pristine.addValidator(
    hashtagsField,
    validateNonEmptyHashtag,
    'Хэш-тег не может состоять только из символа #'
  );

  pristine.addValidator(
    commentField,
    validateComment,
    `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
  );

  formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      blockSubmitButton();
      sendData(
        () => {
          closeImageUploadOverlay();
          showSuccessMessage();
          unblockSubmitButton();
        },
        () => {
          showErrorMessage();
          unblockSubmitButton();
        },
        new FormData(evt.target)
      );
    }
  });
}

function setupAccessibility() {
  if (!hashtagsField || !commentField) {
    return;
  }
  hashtagsField.setAttribute('aria-describedby', 'hashtags-error');
  commentField.setAttribute('aria-describedby', 'comment-error');
}

function initImageUploadForm() {
  if (!formElement || !fileField) {
    return;
  }

  if (!findFormElements()) {
    return;
  }

  setupAccessibility();

  fileField.addEventListener('change', onFileFieldChange);

  hashtagsField.addEventListener('keydown', onFieldKeydown);
  commentField.addEventListener('keydown', onFieldKeydown);

  initScale();
  initEffects();
  initFormValidation();
}

export { initImageUploadForm };

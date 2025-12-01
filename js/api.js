const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const sendData = (onSuccess, onFail, body) => {
  fetch(SERVER_URL, {
    method: 'POST',
    body,
  })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });
};

export { sendData };

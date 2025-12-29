
const LIKES_STORAGE_KEY = 'kekstagram-likes';

let likedPhotos = {};

const loadLikedState = () => {
  try {
    const savedState = localStorage.getItem(LIKES_STORAGE_KEY);
    if (savedState) {
      likedPhotos = JSON.parse(savedState);
    }
  } catch (err) {
    likedPhotos = {};
  }
};

const saveLikedState = () => {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedPhotos));
  } catch (err) {
    // ignore error
  }
};

const isPhotoLiked = (photoId) => Boolean(likedPhotos[photoId]);

const setPhotoLiked = (photoId, isLiked) => {
  if (isLiked) {
    likedPhotos[photoId] = true;
  } else {
    delete likedPhotos[photoId];
  }
  saveLikedState();
};

const togglePhotoLike = (photoId) => {
  const newState = !isPhotoLiked(photoId);
  setPhotoLiked(photoId, newState);
  return newState;
};

loadLikedState();

export { isPhotoLiked, togglePhotoLike };

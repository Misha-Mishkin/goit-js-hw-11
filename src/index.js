import styles from './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ServiceAPI from './js/service-api';
import markup from './js/markup';

const refs = {
    form: document.querySelector('.search-form'),
    button: document.querySelector('[type=submit]'),
    gallery: document.querySelector('.gallery'),
};

const options = {
  simpleLightBox: {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  },
  intersectionObserver: {
    root: null,
    threshold: 1,
  },
};

const loadService = new ServiceAPI();

refs.form.addEventListener('submit', onFormSubmit);

const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    observer.unobserve(entries[0].target);
    loadPictures();
  }
};
const observer = new IntersectionObserver(callback, options.intersectionObserver);

let galleryLightBox = new SimpleLightbox('.gallery a', options.simpleLightBox);

function onFormSubmit(e) {
  e.preventDefault();

  const isFilled = e.currentTarget.elements.searchQuery.value;
  if (isFilled) {
    refs.button.disabled = true;
    loadService.searchQuery = isFilled;
    loadService.resetPage();
    refs.gallery.innerHTML = '';
    loadPictures();
  }
}

function loadPictures() {
  loadService
    .getPictures()
    .then(dataProcessing)
    .catch(error => {
      console.log(error);
      Notify.failure('Something went wrong, please try again...');
    });
}

function dataProcessing(data) {
  refs.button.disabled = false;
  if (data.data.totalHits === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  if (data.data.totalHits !== 0 && data.data.hits.length === 0) {
    Notify.warning(`We're sorry, but you've reached the end of search results.`);
    return;
  }

  refs.gallery.insertAdjacentHTML('beforeend', markup(data.data.hits));

  galleryLightBox.refresh();

  if (loadService.pageNumber === 2) {
    Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
  } else {
    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2 + 120,
      behavior: 'smooth',
    });
  }
  observer.observe(refs.gallery.lastElementChild);
}



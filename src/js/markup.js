export default function markup(data) {
    return data
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
  <div class="photo-card">
  <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div>
      <p>
        <b>Likes: ${likes}</b>
      </p>
      <p>
        <b>Views: ${views}</b>
      </p>
      <p>
        <b>Comments: ${comments}</b>
      </p>
      <p>
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`;
    })
    .join('');
}
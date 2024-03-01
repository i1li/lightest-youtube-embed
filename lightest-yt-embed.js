class IfYouDontHave extends HTMLElement {
}
customElements.define('if-you-dont-have', IfYouDontHave);
function toggleVideo(button, videoId) {
  const [id, params] = videoId.split('?');
  const videoUrl = params ? `https://www.youtube-nocookie.com/embed/${id}?${params}` : `https://www.youtube-nocookie.com/embed/${id}`;
  var youDontHaveStyle = button.nextElementSibling;
  if (youDontHaveStyle.innerHTML === '') {
    youDontHaveStyle.innerHTML = `<iframe src="${videoUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    button.nextElementSibling.style.display = 'block';
  } else {
    youDontHaveStyle.innerHTML = '';
    button.nextElementSibling.style.display = 'none';
  }
}

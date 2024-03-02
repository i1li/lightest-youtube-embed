class YTEmbed extends HTMLElement {
  constructor() {
    super();
    const [id, params] = this.getAttribute('id').split('?');
    const baseUrl = this.classList.contains('no-link-embed') || this.classList.contains('no-embed') ? 'https://www.youtube.com/watch?v=' : 'https://www.youtube-nocookie.com/embed/';
    const separator = baseUrl.includes('youtube-nocookie.com') ? '?' : '&';
    let href = `${baseUrl}${id}${separator}${params ? `${params}&` : ''}autoplay=1`;
    this.style.width = '100%';
    this.link = document.createElement('a');
    this.link.textContent = this.getAttribute('title') || 'View Video';
    this.link.title = 'View video in new tab';
    this.link.href = href;
    this.appendChild(this.link);
    if (!this.classList.contains('no-embed')) {
      this.button = document.createElement('button');
      this.button.textContent = 'Show/Hide';
      this.button.className = 'showHideButton';
      this.button.onclick = () => this.toggleVideo();
      this.appendChild(this.button);
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'yt-wrapper';
      this.appendChild(this.wrapper);
    }
  }
  connectedCallback() {
    if (this.hasAttribute('id')) {
      this.videoId = this.getAttribute('id');
    }
  }
  toggleVideo() {
    const iframeExists = this.wrapper.querySelector('iframe');
    if (!iframeExists) {
      const [id, params] = this.videoId.split('?');
      const iframeSrc = params ? `https://www.youtube-nocookie.com/embed/${id}?${params}&autoplay=1` : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      const iframe = document.createElement('iframe');
      iframe.src = iframeSrc;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.className = 'yt';
      this.wrapper.appendChild(iframe);
      this.wrapper.style.display = 'block';
    } else {
      this.wrapper.removeChild(iframeExists);
      this.wrapper.style.display = 'none';
    }
  }
}
customElements.define('y-t', YTEmbed);

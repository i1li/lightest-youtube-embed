class YTEmbed extends HTMLElement {
  constructor() {
    super();
    const v = this.getAttribute('v');
    const [id, params] = v.split('?');
    this.id = id;
    this.params = params;
    const videoIds = this.id.split(',');
    this.videoIds = videoIds;
    let linkUrl , embedUrl;
    switch (true) {
      case this.videoIds.length > 1:
        if (this.classList.contains('no-link-embed')) {
          linkUrl = `https://www.youtube.com/watch_videos?video_ids=${this.videoIds.join(',')}&autoplay=1`;
          embedUrl = `https://www.youtube-nocookie.com/embed/?playlist=${this.videoIds.join(',')}&autoplay=1`;
        } else if (this.classList.contains('no-embed')) {
          linkUrl = `https://www.youtube.com/watch_videos?video_ids=${this.videoIds.join(',')}&autoplay=1`;
        } else {
          linkUrl = `https://www.youtube-nocookie.com/embed/?playlist=${this.videoIds.join(',')}&autoplay=1`;
          embedUrl = linkUrl;
        }
        break;
      case this.id.startsWith('PL') || this.id.startsWith('TL'):
        if (this.classList.contains('no-link-embed')) {
          linkUrl = `https://www.youtube.com/playlist?list=${this.id}&autoplay=1`;
          embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${this.id}&autoplay=1`;
        } else if (this.classList.contains('no-embed')) {
          linkUrl = `https://www.youtube.com/playlist?list=${this.id}&autoplay=1`;
        } else {
          linkUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${this.id}&autoplay=1`;
          embedUrl = linkUrl;
        }
        break;
      default:
        if (this.classList.contains('no-link-embed')) {
          linkUrl = `https://www.youtube.com/watch?v=${this.id}${this.params ? '&' + this.params + '&': '&'}autoplay=1`;
          embedUrl = `https://www.youtube-nocookie.com/embed/${this.id}${this.params ? '?' + this.params + '&' : '?'}autoplay=1`;
        } else if (this.classList.contains('no-embed')) {
          linkUrl = `https://www.youtube.com/watch?v=${this.id}${this.params ? '&' + this.params + '&' : '&'}autoplay=1`;
        } else {
          linkUrl = `https://www.youtube-nocookie.com/embed/${this.id}${this.params ? '?' + this.params + '&' : '?'}autoplay=1`;
          embedUrl = linkUrl;
        }
        break;
    }
    this.linkUrl = linkUrl;
    this.embedUrl = embedUrl;
    this.link = document.createElement('a');
    this.link.textContent = this.getAttribute('t') || 'View Video';
    this.link.title = 'View video in new tab';
    this.link.href = this.linkUrl;
    this.button = document.createElement('button');
    this.button.textContent = '▶️ Play';
    this.button.title = 'Play Video';
    this.button.className = 'showHideButton';
    if (this.classList.contains('no-embed')) {
      this.button.onclick = () => window.open(this.linkUrl);
      this.appendChild(this.button);
      this.appendChild(this.link);
    } else {
      this.button.onclick = () => this.toggleVideo();
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'yt-wrapper';
      this.appendChild(this.button);
      this.appendChild(this.link);
      this.appendChild(this.wrapper);
    }
  }
  toggleVideo() {
    const iframeExists = this.wrapper.querySelector('iframe');
    if (!iframeExists) {
      const iframe = document.createElement('iframe');
      iframe.src = this.embedUrl;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.className = 'yt';
      this.wrapper.appendChild(iframe);
      this.wrapper.style.display = 'block';
      this.button.textContent = '⏹️ Stop';
      this.button.title = 'Stop Video';
    } else {
      this.wrapper.removeChild(iframeExists);
      this.wrapper.style.display = 'none';
      this.button.textContent = '▶️ Play';
      this.button.title = 'Play Video';
    }
  }
}
customElements.define('y-t', YTEmbed);

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
    this.throttledCheckViewport = this.checkViewport.bind(this);
    this.throttledCheckViewport = throttle(this.throttledCheckViewport, 500);
    switch (true) {
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
      case this.id.length > 11 && (this.id.startsWith('PL') || this.id.startsWith('TL') || this.id.startsWith('OL') || this.id.startsWith('FL') || this.id.startsWith('UU')):
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
      this.closeOtherVideos();
      const iframe = document.createElement('iframe');
      iframe.src = this.embedUrl;
      iframe.allowFullscreen = true;
      iframe.className = 'yt';
      this.wrapper.appendChild(iframe);
      this.wrapper.style.display = 'block';
      this.button.textContent = '⏹️ Stop';
      this.button.title = 'Stop Video';
      this.setAttribute('data-now-playing', 'true');
      const article = this.closest('article');
      const section = this.closest('section');
      let path = '/';
      if (article) {
        path += article.id;
        if (section) {
          path += `/${section.id}`;
        }
      }
      this.setAttribute('data-video-path', path);
      this.createRemoteControl();
      this.setupViewportCheck();
    } else {
      this.wrapper.removeChild(iframeExists);
      this.wrapper.style.display = 'none';
      this.button.textContent = '▶️ Play';
      this.button.title = 'Play Video';
      this.removeAttribute('data-now-playing');
      this.removeAttribute('data-video-path');
      this.removeRemoteControl();
    }
  }
  closeOtherVideos() {
    const playingVideos = document.querySelectorAll('y-t[data-now-playing]');
    playingVideos.forEach(video => {
      if (video !== this) {
        const button = video.querySelector('button.showHideButton');
        if (button && button.textContent === '⏹️ Stop') {
          video.removeAttribute('data-now-playing');
          video.removeAttribute('data-video-path');
          const wrapper = video.querySelector('.yt-wrapper');
          if (wrapper) {
            const iframe = wrapper.querySelector('iframe');
            if (iframe) {
              wrapper.removeChild(iframe);
            }
            wrapper.style.display = 'none';
          }
          button.textContent = '▶️ Play';
          button.title = 'Play Video';
        }
      }
    });
  }
  createRemoteControl() {
    let remoteControl = document.getElementById('remote-control');
    if (!remoteControl) {
      remoteControl = document.createElement('div');
      remoteControl.id = 'remote-control';
      remoteControl.style.opacity = '0';
      remoteControl.style.pointerEvents = 'none';
      document.body.appendChild(remoteControl);
      const nowPlayingText = document.createElement('div');
      nowPlayingText.id = 'now-playing-text';
      nowPlayingText.innerHTML = '🔊Now<br>Playing:';
      nowPlayingText.style.opacity = '0';
      nowPlayingText.style.pointerEvents = 'none';
      document.body.appendChild(nowPlayingText);
      const expandIcon = document.createElement('div');
      expandIcon.id = 'expand-icon';
      expandIcon.setAttribute('aria-label', 'Expand Remote Control');
      document.body.appendChild(expandIcon);      
      const showRemoteControl = () => {
        remoteControl.style.opacity = '0.7';
        remoteControl.style.pointerEvents = 'auto';
        expandIcon.style.opacity = '0';
        expandIcon.style.pointerEvents = 'none';
        nowPlayingText.style.opacity = '0';
        nowPlayingText.style.pointerEvents = 'none';
      };
      expandIcon.onclick = showRemoteControl;
      expandIcon.onmouseenter = showRemoteControl;
      remoteControl.onmouseleave = () => {
        if (this.isOutOfViewport()) {
          remoteControl.style.opacity = '0';
          remoteControl.style.pointerEvents = 'none';
          expandIcon.style.opacity = '0.2';
          expandIcon.style.pointerEvents = 'auto';
          nowPlayingText.style.opacity = '0.55';
          nowPlayingText.style.pointerEvents = 'auto';
        }
      };
    }
    remoteControl.innerHTML = '';
    const stopButton = this.button.cloneNode(true);
    stopButton.style = '';
    stopButton.onclick = () => this.toggleVideo();
    const linkToVideo = document.createElement('a');
    linkToVideo.textContent = 'Go to video';
    linkToVideo.style.marginTop = '10px';
    linkToVideo.onclick = (e) => {
      e.preventDefault();
      this.navigateToNowPlaying();
    };
    this.updateNowPlayingLink(linkToVideo);
    remoteControl.appendChild(stopButton);
    remoteControl.appendChild(linkToVideo);
    this.checkViewport();
  }
  checkViewport() {
    const remoteControl = document.getElementById('remote-control');
    const expandIcon = document.getElementById('expand-icon');
    const nowPlayingText = document.getElementById('now-playing-text');
    if (this.isOutOfViewport()) {
      if (remoteControl) {
        remoteControl.style.opacity = '0';
        remoteControl.style.pointerEvents = 'none';
      }
      if (expandIcon) {
        expandIcon.style.opacity = '0.2';
        expandIcon.style.pointerEvents = 'auto';
      }
      if (nowPlayingText) {
        nowPlayingText.style.opacity = '0.55';
        nowPlayingText.style.pointerEvents = 'auto';
      }
    } else {
      if (remoteControl) {
        remoteControl.style.opacity = '0';
        remoteControl.style.pointerEvents = 'none';
      }
      if (expandIcon) {
        expandIcon.style.opacity = '0';
        expandIcon.style.pointerEvents = 'none';
      }
      if (nowPlayingText) {
        nowPlayingText.style.opacity = '0';
        nowPlayingText.style.pointerEvents = 'none';
      }
    }
  }
  setupViewportCheck() {
    ['scroll', 'touchmove', 'resize'].forEach(event => window.addEventListener(event, this.throttledCheckViewport));
    this.checkViewport();
  }
  isOutOfViewport() {
    const rect = this.getBoundingClientRect();
    return (
      rect.bottom <= 0 ||
      rect.right <= 0 ||
      rect.left >= window.innerWidth ||
      rect.top >= window.innerHeight
    );
  }
  updateNowPlayingLink(linkElement) {
    const path = this.getAttribute('data-video-path');
    if (path) {
      linkElement.href = `${path}#now-playing`;
    }
  }
  navigateToNowPlaying() {
    const nowPlaying = document.querySelector('y-t[data-now-playing]');
    if (nowPlaying) {
      const path = nowPlaying.getAttribute('data-video-path');
      if (path) {
        navigate(path.substring(1));
        setTimeout(() => {
          const y = nowPlaying.getBoundingClientRect().top + window.pageYOffset - window.innerHeight * 0.1;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 20);
      }
    }
  }
  removeEventListeners() {
    ['scroll', 'touchmove', 'resize'].forEach(event => window.removeEventListener(event, this.throttledCheckViewport));
  }
  removeRemoteControl() {
    const remoteControl = document.getElementById('remote-control');
    if (remoteControl) {
      document.body.removeChild(remoteControl);
    }
    const expandIcon = document.getElementById('expand-icon');
    if (expandIcon) {
      document.body.removeChild(expandIcon);
    }
    const nowPlayingText = document.getElementById('now-playing-text');
    if (nowPlayingText) {
      document.body.removeChild(nowPlayingText);
    }
    this.removeEventListeners()
  }
}
customElements.define('y-t', YTEmbed);

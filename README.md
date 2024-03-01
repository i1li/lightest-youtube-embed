# Lightest Youtube Embed
The lightest youtube video embedder ever. Show/ hide toggle button saves space and resources until needed.
Example usage:
```html
<a href="https://www.youtube.com/watch?v=_mEsA9uFug8" rel="noreferrer" target="_blank">"Astropilot - Weightless Mind"</a>
<button class="showHideButton" onclick="toggleVideo(this, '_mEsA9uFug8')">Show/Hide</button>
<if-you-dont-have class="you-dont-have-style"></if-you-dont-have>
```

You can include [params](https://developers.google.com/youtube/player_parameters#Parameters) like in the following examples:
```html
<a href="https://www.youtube.com/watch?v=Yta55u2zP2U">"The Gender War (Könskriget), pt1 [1/6] English subs (click CC)"</a>
<button class="showHideButton" onclick="toggleVideo(this, 'Yta55u2zP2U?cc_lang_pref=en&cc_load_policy=1')">Show/Hide</button>
<if-you-dont-have class="you-dont-have-style"></if-you-dont-have>
<br/>
<a href="https://www.youtube.com/watch?v=2rzvoKbZXZg&t=60">"How Covert Narcissists Brain Wash Their Victims"</a>
<button class="showHideButton" onclick="toggleVideo(this, '2rzvoKbZXZg?start=60')">Show/Hide</button>
<if-you-dont-have class="you-dont-have-style" style="opacity: .7;"></if-you-dont-have>
```
You can view the [Demo site](https://y0.netlify.app/) as part of [Minimal, Responsive, Pure Javascript, Single Page App](https://github.com/i1li/i)

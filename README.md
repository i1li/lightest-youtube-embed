# Lightest Youtube Embed
The lightest youtube video embed ever: elimates need for Youtube Iframe API, with totally responsive resizing, and inline capability that doesn't cause line breaks. Show / hide toggle button eliminates wasted space and resources, and increases user privacy.

You can view the [Demo site](https://y0.netlify.app/) as part of [Minimal, Responsive, Pure Javascript, Single Page App](https://github.com/i1li/i)
### Example usage:
```html
<y-t id="_mEsA9uFug8" title="Music: Astropilot - Weightless Mind"></y-t>
```
Shows a link with the title as text, with a show/hide button next to it. 

"id" is just the part from the Youtube URL, after the part that says "watch?v="


You can include [params](https://developers.google.com/youtube/player_parameters#Parameters) like in the following examples:
```html
<y-t id="2rzvoKbZXZg?start=60" title="How Covert Narcissists Brain Wash Their Victims"></y-t><br/>
<y-t id="JSggxkx6iDo?end=3542" title="Music: Erothyme + Actualize Visuals - Featherbed Sessions Mix"></y-t><br/>
<y-t id="Yta55u2zP2U?cc_lang_pref=en&cc_load_policy=1" title="The Gender War (Könskriget)"></y-t>
```
If a video is set as not embeddable by Youtube and you'd just like to make a link for it, just include class name "no-embed":
```html
<y-t id="u05S9cq2bLY" class="no-embed" title="Music: A Perfect Circle - Disillusioned"></y-t>
```
Links for videos by default open at Youtube's minimal embed address, youtube-nocookie.com/embed . Some videos are allowed to be embedded, but not played at the standalone embed address, so just give those the class name "no-link-embed", and they will still be embedded, but the hyperlink will be to the main youtube.com version. (Links with "no-embed" class already get this behavior)
```html
<y-t id="_mEsA9uFug8" class="no-link-embed" title="Astropilot - Weightless Mind"></y-t>
```

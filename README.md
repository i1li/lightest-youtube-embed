# Lightest Youtube Embed
The lightest youtube video embed ever: eliminates need for Youtube Iframe API, with totally responsive resizing, and inline capability that doesn't cause line breaks. Show / hide toggle button eliminates wasted space and resources, and increases user privacy.

You can view the [Demo site](https://y0.netlify.app/) as part of [Minimal, Responsive, Pure Javascript, Single Page App](https://github.com/i1li/i)
### Example usage:
```html
<y-t v="_mEsA9uFug8" t="Music: Astropilot - Weightless Mind"></y-t>
```
Shows a link to view in new tab, with a show/hide button next to it. 

'v' is just the id from the Youtube URL, after the part that says "watch?v="

't' is an optional field for title, if empty, default text is "View Video", or use 'add-titles.js' to automatically populate 't' with it's title on YouTube. To do this, simply run 'npm i axios' and then 'node add-titles.js'. This will add appropriate 't' attributes to every <y-t> element that doesn't already have one in your index.html file.


You can include [params](https://developers.google.com/youtube/player_parameters#Parameters) like in the following examples:
```html
<y-t v="2rzvoKbZXZg?start=60" t="How Covert Narcissists Brain Wash Their Victims"></y-t><br/>
<y-t v="JSggxkx6iDo?end=3542" t="Music: Erothyme + Actualize Visuals - Featherbed Sessions Mix"></y-t><br/>
<y-t v="Yta55u2zP2U?cc_lang_pref=en&cc_load_policy=1" t="The Gender War (Könskriget)"></y-t>
```
If a video is set as not embeddable by Youtube and you'd just like to make a link for it, include class name "no-embed":
```html
<y-t v="u05S9cq2bLY" class="no-embed" t="Music: A Perfect Circle - Disillusioned"></y-t>
```
Links for videos by default open at Youtube's minimal embed address, youtube-nocookie.com/embed . Some videos are allowed to be embedded, but not played at the standalone embed address, so just give those the class name "no-link-embed", and they will still be embedded, but the hyperlink will be to the main youtube.com version. (Links with "no-embed" class already get this behavior)
```html
<y-t v="_mEsA9uFug8" class="no-link-embed" t="Astropilot - Weightless Mind"></y-t>
```

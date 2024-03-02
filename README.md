# Lightest Youtube Embed
The lightest youtube video embedder ever. Show/ hide toggle button saves space and resources until needed.
Example usage:
```html
<y-t id="_mEsA9uFug8" title="Astropilot - Weightless Mind"></y-t>
```
Shows a link 
You can include [params](https://developers.google.com/youtube/player_parameters#Parameters) like in the following examples:
```html
<y-t id="2rzvoKbZXZg?start=60" title="How Covert Narcissists Brain Wash Their Victims"></y-t><br/>
<y-t id="JSggxkx6iDo?end=3542" title="Music: Erothyme + Actualize Visuals - Featherbed Sessions Mix"></y-t><br/>
<y-t id="Yta55u2zP2U?cc_lang_pref=en&cc_load_policy=1" title="The Gender War (Könskriget)"></y-t><br/>
```
If a video is set as not embeddable by Youtube and you'd just like to make a link for it, just include class name "no-embed":
```html
<y-t id="u05S9cq2bLY" class="no-embed" title="A Perfect Circle - Disillusioned [Audio]"></y-t>
```
You can view the [Demo site](https://y0.netlify.app/) as part of [Minimal, Responsive, Pure Javascript, Single Page App](https://github.com/i1li/i)

# Lightest YouTube Embed
The lightest YouTube video embed ever: eliminates need for YouTube Iframe API, with totally responsive resizing, and inline capability that doesn't cause line breaks. Also supports playlist embedding, and playlist creation from scratch without an account. Show / hide toggle button eliminates wasted space and resources, and increases user privacy.

You can view the [Demo site](https://y0.netlify.app/) as part of [Minimal, Responsive, Pure Javascript, Single Page App](https://github.com/i1li/i)
### Example usage:
```html
<y-t v="_mEsA9uFug8" t="Music: Astropilot - Weightless Mind"></y-t><br/>
<y-t v="GS9ImrohkW4,1sCoTSHn7WE" t="State Azure"></y-t><br/>
<y-t v="PLiz2G6tBYC82nX1lRH9ShOoBm3j2p2ROm" class="no-link-embed" t="Alan Watts Chillstep"></y-t>
```
Shows a link to view in new tab, with a show/hide button next to it.

'v' is just the id from the YouTube URL, after the part that says "watch?v=", or for playlists it begins with 'PL'. You can use a playlist ID from a playlist that is already generated, or make your own by putting multiple video IDs, comma separated.

't' is an optional field for title, if empty, default text is "View Video", or use `add-titles.js` to automatically populate 't' with it's title on YouTube. To do this, simply run `npm i axios` and then `node add-titles.js`. This will add appropriate 't' attributes to every <y-t> element that doesn't already have one in your index.html file.


You can include [params](https://developers.google.com/YouTube/player_parameters#Parameters) like in the following examples:
```html
<y-t v="2rzvoKbZXZg?start=60" t="How Covert Narcissists Brain Wash Their Victims"></y-t><br/>
<y-t v="JSggxkx6iDo?end=3542" t="Music: Erothyme + Actualize Visuals - Featherbed Sessions Mix"></y-t><br/>
<y-t v="Yta55u2zP2U?cc_lang_pref=en&cc_load_policy=1" t="The Gender War (Könskriget)"></y-t>
```
If a video is set as not embeddable by YouTube and you'd just like to make a link for it, include class name "no-embed":
```html
<y-t v="u05S9cq2bLY" class="no-embed" t="Music: A Perfect Circle - Disillusioned"></y-t>
```
Links for videos by default open at YouTube's minimal embed address, youtube-nocookie.com/embed . Some videos are allowed to be embedded, but not played at the standalone embed address, so just give those the class name "no-link-embed", and they will still be embedded, but the hyperlink will be to the main youtube.com version. (Links with "no-embed" class already get this behavior)
```html
<y-t v="_mEsA9uFug8" class="no-link-embed" t="Astropilot - Weightless Mind"></y-t>
```


TODO: handle detection of embed permissions, to assign "no-embed" and "no-link-embed" automatically. Please submit a comment or pull request if you know a solution.

#### Code Summary

The code defines a class `YTEmbed` that extends `HTMLElement`, allowing you to create a custom web component. Here's a breakdown of the key parts of the code:

-   **Constructor**: Initializes the custom element, parsing the video ID and parameters from the element's `id` attribute. It decides the base URL based on the presence of certain classes and constructs the video URL accordingly. It also creates a link as a fallback or primary way to view the video and a button to toggle the video display.
    
-   `toggleVideo`** Method**: Checks if an iframe already exists within the element. If not, it creates one with the appropriate source URL and adds it to the DOM, allowing the video to be played within the page. If an iframe exists, it removes it, effectively toggling the video display.
    
-   **Custom Element Registration**: The last line of the code, `customElements.define('y-t', YTEmbed);`, registers the custom element with the browser, allowing you to use `<y-t>` tags in your HTML to embed YouTube videos with this custom behavior.
    

#### Key JavaScript Features Used

-   **Template Literals**: Used for string interpolation and constructing URLs dynamically. Template literals are enclosed by backtick (\`) characters and allow embedded expressions, which are included in the string using `${expression}` syntax [1](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), [2](https://www.w3schools.com/js/js_string_templates.asp)
    
-   **Custom Elements API**: Allows developers to define new HTML tags (custom elements) and their behavior. The `customElements.define()` method registers a new custom element with the browser [3](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
    
-   **DOM API**: Methods like `document.createElement()`, `appendChild()`, and `querySelector()` are used to dynamically manipulate the page's content by adding or removing elements [4](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute), [5](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement), [6](https://www.w3schools.com/jsref/met_document_createelement.asp)
    
-   `getAttribute`** Method**: Retrieves the value of a specified attribute from the element. If the attribute does not exist, it returns `null` or an empty string [7](https://www.w3schools.com/jsref/met_element_getattribute.asp)
    

This code exemplifies modern JavaScript practices for creating reusable web components that enhance the functionality and interactivity of web pages.
